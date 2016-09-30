'use strict';

const _ = require('underscore');
const async = require('async');
const sprintf = require('sprintf-js').sprintf;

const Customer = require('../models/customer');
const Address = require('../models/address');

/*
 * TODO: Move these mapping functions to a data layer. The service shouldn't 
 * know about them.
 */
function mapDbObjectToCustomerAttributes (dbObject) {
  return {
    id: dbObject.id,
    firstName: dbObject.first_name,
    lastName: dbObject.last_name,
    addressRef: dbObject.address_ref,
    phoneNumber: dbObject.phone_number,
    deleted: dbObject.deleted
  };
}

function mapCustomerToDbObject (customer) {
  var result = {
    id: customer.id
  }

  if (customer.firstName) {
    result.first_name = customer.firstName;
  }
  if (customer.lastName) {
    result.last_name = customer.lastName;
  }
  if (customer.addressRef) {
    result.address_ref = customer.addressRef;
  }
  if (customer.phoneNumber) {
    result.phone_number = customer.phoneNumber;
  }
  if (customer.deleted) {
    result.deleted = customer.deleted;
  }

  return result;
}

module.exports = class CustomerService {
  constructor(dao, addressService) {
    this.dao = dao;
    this.addressService = addressService;
  }

  // May throw expeptions.
  create(input) {
    if (input instanceof Customer) {
      return input;
    } else {
      var attributes = input;
      if (attributes.address) {
        var addressData = attributes.address;
        var newAddress = new Address(addressData);
        attributes.address = newAddress;
      }
      var newCustomer = new Customer(attributes);
      return newCustomer;
    }
  }

  save(customer, callback) {
    console.log(sprintf("Proceeding to save Customer %s.", customer.id));
    this.addressService.save(customer.address, (err, res) => {
      if (err) {
        callback(err);
      } else {
        var customerDbObject = mapCustomerToDbObject(customer);
        console.log(sprintf("Ready to persist: %s.", JSON.stringify(customerDbObject)));
        this.dao.persist(customerDbObject, (err, item) => {
          if (err) {
            console.log(sprintf("Error while trying to persist: %s.", JSON.stringify(customerDbObject)));
            callback(err);
          } else {
            callback(null, customer);
          }
        });
      }
    });
  }

  delete(customer, callback) {
    console.log(sprintf("Proceeding to delete Customer %s.", customer.id));
    this.dao.delete({id: customer.id}, (err, customerDbObject) => {
      // TODO: refactor this part to be DRY, as it is shared.
      var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);
      var addressId = customerAttributes.addressRef;
      this.addressService.fetch(addressId, (err, address) => {
        if (err) {
          callback(err);
        } else {
          customerAttributes.address = address;

          try {
            var customer = this.create(customerAttributes);
          } catch(err) {
            callback(err);
          }
          
          console.log("Successfully fetched Customer with id: " + customer.id);
          callback(null, customer);
        }
      });
    });
  }

  update(customer, callback) {
    console.log(sprintf("Proceeding to update Customer %s.", customer.id));

    var returnCustomer = (customerAttributes, callback) => {
      try {
        var customer = this.create(customerAttributes);
      } catch(err) {
        callback(err);
      }
      
      console.log("Successfully updated Customer with id: " + customer.id);
      callback(null, customer);
    };

    var updateCustomer = (customer, updatedAddress, callback) => {
      var customerDbObject = mapCustomerToDbObject(customer);
      var key = customerDbObject.id;
      var attributesToUpdate = _.omit(customerDbObject, 'id');
      console.log(sprintf("Ready to update: %s.", JSON.stringify(customerDbObject)));
      this.dao.update({id: key}, attributesToUpdate, (err, customerDbObject) => {
        if (err) {
          console.log(sprintf("Error while trying to update: %s.", JSON.stringify(customerDbObject)));
          callback(err);
        } else {
          var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);

          if (!updatedAddress) {
            var addressId = customerAttributes.addressRef;
            this.addressService.fetch(addressId, (err, address) => {
              if (err) {
                callback(err);
              } else {
                customerAttributes.address = address;
                returnCustomer(customerAttributes, callback);
              }
            });
          } else {
            customerAttributes.address = updatedAddress;
            returnCustomer(customerAttributes, callback);
          }
        }
      });
    }

    var addressInformationChanged = customer.address;
    if (addressInformationChanged) {
      this.addressService.update(customer.address, (err, updatedAddress) => {
        if (err) {
          callback(err);
        } else {
          updateCustomer(customer, updatedAddress, callback);
        }
      });
    } else {
      updateCustomer(customer, null, callback);
    }
  }

  fetch(id, callback) {
    if (id) {
      // Fetch just one.
      var isValidId = Customer.isValidId(id);
      if (isValidId) {
        var queryResult = this.dao.fetch({id: id}, (err, customerDbObject) => {
          var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);
          var addressId = customerAttributes.addressRef;
          this.addressService.fetch(addressId, (err, address) => {
            if (err) {
              callback(err);
            } else {
              customerAttributes.address = address;

              try {
                var customer = this.create(customerAttributes);
              } catch(err) {
                callback(err);
              }
              
              console.log("Successfully fetched Customer with id: " + customer.id);
              callback(null, customer);
            }
          });
        });
      } else {
        // Raise error.
      }
    } else {
      // Fetch all.
      this.dao.fetch(null, (err, customerDbObjects) => {
        var customers = [];

        var forEachCustomerDbObject = (customerDbObject, innerCallback) => {
          // TODO: although parallel, this is a n+1 query! Optimize asap.
          var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);
          var addressId = customerAttributes.addressRef;
          this.addressService.fetch(addressId, (err, address) => {
            if (err) {
              callback(err);
            } else {
              customerAttributes.address = address;

              try {
                var customer = this.create(customerAttributes);
              } catch(err) {
                callback(err);
              }              

              customers.push(customer);
              innerCallback();
            }
          });
        }

        function done() {
          console.log("Successfully fetched all Customers.");
          callback(err, customers);
        }

        async.each(customerDbObjects, forEachCustomerDbObject, done);
      });
    }
  }
}
