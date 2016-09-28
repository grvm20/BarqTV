'use strict';

const _ = require('underscore');

const Customer = require('../models/customer');
const CustomerSerializer = require('../views/customer-serializer');

function sendHttpResponse(callback) {
  return (err, body) => {
    callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : body,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };
}

module.exports = class CustomersController {

  static show(params, callback) {
    var areValidParams = _.isObject(params);
    
    if (areValidParams) {
      var containsEmail = _.isString(params.email);

      if (containsEmail) {
        var email = params.email;
        Customer.find(email, (err, customer) => {
          CustomerSerializer.render(customer, sendHttpResponse(callback));
        });
      } else {
        // Return all customers.
        Customer.all((err, customers) => {
          CustomerSerializer.render(customers, sendHttpResponse(callback));
        });
      }
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  static create(attributes, callback) {
  }
};
