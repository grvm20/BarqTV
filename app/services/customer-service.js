'use strict';

const _ = require('underscore');
const async = require('async');

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
  return {
    id: customer.id,
    first_name: customer.firstName,
    last_name: customer.lastName,
    address_ref: customer.addressRef,
    phone_number: customer.phoneNumber,
    deleted: customer.deleted
  }
}

module.exports = class CustomerService {
  constructor(dao, addressService) {
    this.dao = dao;
    this.addressService = addressService;
  }

  create(input) {
    if (input instanceof Customer) {
      return input;
    } else {
      var attributes = input;
      var addressData = attributes.address;
      var newAddress = addressService.createAddress(addressData);
      attributes.address = newAddress;
      var newCustomer = new Customer(attributes);
      return newCustomer;
    }
  }

  save(customer, callback) {
    addressService.saveAddress(customer.address, (err, res) => {
      if (err) {
        callback(err);
      } else {
        var customerDbObject = mapCustomerToDbObject(customer);
        console.log("Ready to persist: %s", JSON.stringify(customerDbObject));
        this.dao.persist(customerDbObject, (err, item) => {
          if (err) {
            console.log("Error while trying to persist: %s", JSON.stringify(customerDbObject));
            callback(err);
          } else {
            callback(null, customer);
          }
        });
      }
    });
  }

  fetch(id, callback) {
    if (id) {
      // Fetch just one.
      var isValidId = Customer.isValidId(id);
      if (isValidId) {
        var queryResult = dao.fetch({id: id}, (err, customerDbObject) => {
          var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);
          var addressId = customerAttributes.addressRef;
          addressService.getAddress(addressId, (error, address) {
            if (err) {
              callback(err);
            } else {
              customerAttributes.address = address;
              var customer = this.create(customerAttributes);
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

        function forEachCustomerDbObject (customerDbObject, innerCallback) {
          // TODO: although parallel, this is a n+1 query! Optimize asap.
          var customerAttributes = mapDbObjectToCustomerAttributes(customerDbObject);
          var addressId = customerAttributes.addressRef;
          addressService.getAddress(addressId, (error, address) {
            if (err) {
              callback(err);
            } else {
              customerAttributes.address = address;
              var customer = this.create(customerAttributes);
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
