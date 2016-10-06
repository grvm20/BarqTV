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

function createCustomerKey (id) {
  var key = {
    "id": id
  };
  return key;
}

function mapCustomerToDbObject (customer) {
  var result = {
    id: customer.id
  }

  if (customer.firstName && typeof customer.firstName !== 'undefined') {
    result.first_name = customer.firstName;
  }
  if (customer.lastName && typeof customer.lastName !== 'undefined') {
    result.last_name = customer.lastName;
  }
  if (customer.addressRef && typeof customer.addressRef !== 'undefined') {
    result.address_ref = customer.addressRef;
  }
  if (customer.phoneNumber && typeof customer.phoneNumber !== 'undefined') {
    result.phone_number = customer.phoneNumber;
  }
  if (customer.deleted && typeof customer.deleted !== 'undefined') {
    result.deleted = customer.deleted;
  }

  return result;
}

module.exports = class CustomerService {
  constructor (dao, addressService) {
    this.dao = dao;
    this.addressService = addressService;
  }

  /**
   * Builds a Customer object, with all its dependencies. Does not persist it.
   * @input - attributes used to build the Customer.
   * Throws InputValidationException.
   **/
  create (input) {
    if (input instanceof Customer) {
      return input;
    } else {
      var attributes = input;
      if (attributes.address && !attributes.address instanceof Address) {
        var addressData = attributes.address;
        var newAddress = new Address(addressData);
        attributes.address = newAddress;
      }
      var newCustomer = new Customer(attributes);
      return newCustomer;
    }
  }

  /**
   * Saves the given Customer to persistence.
   * @customer - a valid Customer object.
   * @callback - callback function with parameters (err, customer).
   * Throws InputValidationException.
   **/
  save (customer, callback) {
    try {
      customer.validate();
    } catch (err) {
      console.error(err);
      return callback(err);
    }
    console.log(sprintf("Proceeding to save Customer %s.", JSON.stringify(customer)));
    this.isIdAvailable(customer.id, (err, idAvailable) => {
      if (err) {
        console.error(err);
        return callback(err);
      } else if (!idAvailable) {
        callback({message: sprintf("Email address is already in use.", customer.email)});
      } else {
        this.addressService.save(customer.address, (err, res) => {
          if (err) {
            console.error(err);
            return callback(err);
          } else {
            var customerDbObject = mapCustomerToDbObject(customer);
            console.log(sprintf("Ready to persist: %s.",
              JSON  .stringify(customerDbObject)));

            this.dao.persist(createCustomerKey(customer.id), customerDbObject,
              (err, item) => {
                if (err) {
                  console.log(sprintf("Error while trying to persist: %s.",
                    JSON.stringify(customerDbObject)));
                  return callback(err);
                } else {
                  callback(null, customer);
                }
              });
          }
        });
      }
    });
  }

  /**
   * Deletes the given Customer from persistence.
   * @customer - a Customer object.
   * @callback - callback function with parameters (err, customer).
   **/
  delete (customer, callback) {
    console.log(sprintf("Proceeding to delete Customer %s.", customer.id));
    this.dao.delete(createCustomerKey(customer.id), (err, customerDbObject) => {
      // TODO: refactor this part to be DRY, as it is shared.
      var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);
      var addressId = customerAttributes.addressRef;
      this.addressService.fetch(addressId, (err, address) => {
        if (err) {
          console.error(err);
          return callback(err);
        } else {
          customerAttributes.address = address;

          try {
            var customer = this.create(customerAttributes);
          } catch(err) {
            return callback(err);
          }
          
          console.log("Successfully fetched Customer with id: " + customer.id);
          callback(null, customer);
        }
      });
    });
  }

  /**
   * Updates the given Customer and persists its changes.
   * @customer - a Customer object.
   * @callback - callback function with parameters (err, customer).
   **/
  update (customer, callback) {
    console.log(sprintf("Proceeding to update Customer %s.", customer.id));

    var returnCustomer = (customerAttributes, callback) => {
      try {
        var customer = this.create(customerAttributes);
      } catch(err) {
        return callback(err);
      }
      
      console.log("Successfully updated Customer with id: " + customer.id);
      callback(null, customer);
    };

    var updateCustomer = (customer, updatedAddress, callback) => {
      var customerDbObject = mapCustomerToDbObject(customer);
      var key = createCustomerKey(customer.id);
      var attributesToUpdate = _.omit(customerDbObject, 'id');
      console.log(sprintf("Ready to update: %s.", JSON.stringify(customerDbObject)));
      this.dao.update(key, attributesToUpdate, (err, customerDbObject) => {
        if (err) {
          console.log(sprintf("Error while trying to update: %s.",
            JSON.stringify(customerDbObject)));
          return callback(err);
        } else {
          var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);

          if (!updatedAddress) {
            var addressId = customerAttributes.addressRef;
            this.addressService.fetch(addressId, (err, address) => {
              if (err) {
                console.error(err);
                return callback(err);
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
      var addressId = customer.addressRef;
      this.addressService.update(addressId, customer.address, (err, updatedAddress) => {
        if (err) {
          console.error(err);
          return callback(err);
        } else {
          updateCustomer(customer, updatedAddress, callback);
        }
      });
    } else {
      updateCustomer(customer, null, callback);
    }
  }

  /**
   * Fetches Customer objects from persistence and returns them.
   * @id - id corresponding to the Customer that needs to be fetched.
   * If nothing is provided then it returns all Customers.
   * @callback - callback function with parameters (err, customers).
   **/
  fetch (id, callback) {
    if (id) {
      // Fetch just one.
      try {
        var customer = new Customer({id: id});  
      } catch (err) {
        console.error(err);
        return callback(err);
      }
      
      var queryResult = this.dao.fetch({id: customer.id}, (err, customerDbObject) => {
        if (_.isEmpty(customerDbObject)) {
          callback(null, {});
        } else {
          var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);
          var addressId = customerAttributes.addressRef;
          this.addressService.fetch(addressId, (err, address) => {
            if (err) {
              console.error(err);
              return callback(err);
            } else {
              customerAttributes.address = address;

              try {
                var customer = this.create(customerAttributes);
              } catch(err) {
                return callback(err);
              }

              console.log("Successfully fetched Customer with id: " + customer.id);
              callback(null, customer);
            }
          });
        }
      });

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
              console.error(err);
              return callback(err);
            } else {
              customerAttributes.address = address;

              try {
                var customer = this.create(customerAttributes);
              } catch(err) {
                return callback(err);
              }              

              customers.push(customer);
              innerCallback();
            }
          });
        }

        function done () {
          console.log("Successfully fetched all Customers.");
          callback(err, customers);
        }

        async.each(customerDbObjects, forEachCustomerDbObject, done);
      });
    }
  }

  /**
   * Alias for isIdAvailable();
   **/
  isEmailAvailable (email, callback) {
    isIdAvailable (email, callback);
  }

  /**
   * Checks if an ID is being used in persistence.
   * @id - id to be checked.
   * @callback - callback function with parameters (err, isAvailable), where 
   * isAvailable is a boolean.
   **/
  isIdAvailable (id, callback) {
    this.fetch (id, (err, customer) => {
      if (err) {
        console.error(err);
        return callback(err);
      } else if (_.isEmpty(customer)) {
        callback(null, true);
      } else {
        callback(null, false);        
      }
    });
  }
}
