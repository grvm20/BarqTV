'use strict';

const _ = require('underscore');

const TABLE_NAME = 'customers';
const REQUIRED_CUSTOMER_PARAMS = ["email", "first_name", "last_name",
  "phone_number", "city", "street", "number", "zip_code"];

const Dao = require('../../services/dao');
const Address = require('./addresses-model');

const dao = new Dao(TABLE_NAME);

function containsRequiredParams(paramsKeys) {
  _.each(paramsKeys, (element, index) => {
    //this.REQUIRED_CUSTOMER_PARAMS;
  });
}


class Customer {
  constructor(attributes) {
    this.id = attributes.id;
    this.first_name = attributes.first_name;
    this.last_name = attributes.last_name;
    this.address_ref = attributes.address_ref;
    this.phone_number = attributes.phone_number;
  }

  get email() {
    return this.id;
  }

  static all(callback) {
    dao.fetch(null, (err, items) => {
      var customers = _.map(items, (e)=> new this(e))
      console.log("Successfully fetched a Customer array: " + JSON.stringify(customers));
      callback(err, customers);
    });
  }

  static find(email, callback) {
    var isValidEmail = _.isString(email)
    if (isValidEmail) {
      var queryResult = dao.fetch({id: email}, (err, item) => {
        var customer = new this(item);
        console.log("Successfully fetched a Customer: " + JSON.stringify(customer));
        callback(err, customer);
      });
    } else {
      // Raise error.
    }
  }
}

module.exports = Customer;
