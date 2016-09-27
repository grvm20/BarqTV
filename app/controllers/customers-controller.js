'use strict';

const _ = require('underscore');

const Customer = require('../models/customer');

module.exports = class CustomersController {

  static show(params, callback) {
    var areValidParams = _.isObject(params);
    
    if (areValidParams) {
      var containsEmail = _.isString(params.email);

      if (containsEmail) {
        var email = params.email;
        Customer.find(email, callback);
      } else {
        // Return all customers.
        Customer.all(callback);
      }
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  static create(attributes, callback) {
  }
}
