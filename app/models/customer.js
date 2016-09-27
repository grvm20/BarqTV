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
  constructor(email, first_name, last_name, address, phone_number) {
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.address = address;
    this.phone_number = phone_number;
  }

  static all(callback) {
    dao.fetch(null, callback);
  }

  static find(email, callback) {
    var isValidEmail = _.isString(email)
    if (isValidEmail) {
      dao.fetch(email, callback);
    } else {
      // Raise error.
    }
  }
}

module.exports = Customer;
