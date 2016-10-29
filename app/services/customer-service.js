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

  // Using loose equality check (==) instead of strict (===) as explained in:
  // http://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript
  if (customer.firstName != null) {
    result.first_name = customer.firstName;
  }
  if (customer.lastName != null) {
    result.last_name = customer.lastName;
  }
  if (customer.addressRef != null) {
    result.address_ref = customer.addressRef;
  }
  if (customer.phoneNumber != null) {
    result.phone_number = customer.phoneNumber;
  }
  if (customer.deleted != null) {
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
      return callback(err);
    }
    console.log(sprintf("Proceeding to save Customer %s.",
      JSON.stringify(customer)));
    this.isIdAvailable(customer.id, (err, idAvailable) => {
      if (err) {
        return callback(err);
      } else if (!idAvailable) {
        callback({message: sprintf("Email address is already in use.",
          customer.email)});
      } else {
        this.addressService.save(customer.address, (err, res) => {
          if (err) {
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
   * @newCustomer - a Customer object.
   * @callback - callback function with parameters (err, completeCustomer).
   **/
  update (newCustomer, callback) {
    console.log(sprintf("Proceeding to update Customer %s.", newCustomer.id));

    var updateCustomer = (customerToUpdate, callback) => {
      var customerDbObject = mapCustomerToDbObject(customerToUpdate);
      var key = createCustomerKey(customerToUpdate.id);
      var attributesToUpdate = _.omit(customerDbObject, 'id');
      console.log(sprintf("Ready to update: %s.",
        JSON.stringify(customerDbObject)));
      this.dao.update(key, attributesToUpdate, (err, customerDbObject) => {
        if (err) {
          console.log(sprintf("Error while trying to update: %s.",
            JSON.stringify(customerDbObject)));
          return callback(err);
        } else {
          var customerAttributes = mapDbObjectToCustomerAttributes(
            customerDbObject);
          customerAttributes.address = customerToUpdate.address;

          try {
            var newCompleteCustomer = this.create(customerAttributes);
          } catch(err) {
            return callback(err);
          }
          
          console.log("Successfully updated Customer with id: " +
            newCompleteCustomer.id);
          return callback(null, newCompleteCustomer);
        }
      });
    }

    this.fetch(newCustomer.id, (err, currentCustomer) => {
      if (err) {
        return callback(err);
      } else {
        var addressInformationChanged = newCustomer.address;
        if (addressInformationChanged) {
          console.log('Updating its address first.');
          var addressId = currentCustomer.addressRef;
          this.addressService.update(addressId, newCustomer.address,
            (err, updatedAddress) => {
              if (err) {
                return callback(err);
              } else {
                newCustomer.address = updatedAddress;
                updateCustomer(newCustomer, callback);
              }
            }
          );
        } else {
          newCustomer.address = currentCustomer.address;
          updateCustomer(newCustomer, callback);
        }
      }
    }); 
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
        console.error("Customer Variable creation failed!")
        return callback(err);
      }
      
      var queryResult = this.dao.fetch({id: customer.id},
        (err, customerDbObject) => {
          if(err){
        return callback(err);
      }
          if (_.isEmpty(customerDbObject)) {
            callback(null, {});
          } else {
            var customerAttributes = mapDbObjectToCustomerAttributes(
              customerDbObject);
            var addressId = customerAttributes.addressRef;
            this.addressService.fetch(addressId, (err, address) => {
              if (err) {
                return callback(err);
              } else {
                customerAttributes.address = address;

                try {
                  var customer = this.create(customerAttributes);
                } catch(err) {
                  return callback(err);
                }

                console.log("Successfully fetched Customer with id: " +
                  customer.id);
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
          var customerAttributes = mapDbObjectToCustomerAttributes(
            customerDbObject);
          var addressId = customerAttributes.addressRef;
          this.addressService.fetch(addressId, (err, address) => {
            if (err) {
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
        return callback(err);
      } else if (_.isEmpty(customer)) {
        callback(null, true);
      } else {
        callback(null, false);        
      }
    });
  }
}
