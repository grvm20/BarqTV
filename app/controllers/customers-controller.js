'use strict';

const _ = require('underscore');

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

function areValidParams(params) {
  return _.isObject(params)
}

module.exports = class CustomersController {
  constructor(customerService, CustomerSerializer) {
    this.customerService = customerService;
    this.CustomerSerializer = CustomerSerializer;
  }


  static show(params, callback) {
    if (areValidParams(params)) {
      var containsEmail = _.isString(params.email);

      if (containsEmail) {
        var email = params.email;
        this.customerService.fetch(email, (err, customer) => {
          this.CustomerSerializer.render(customer, sendHttpResponse(callback));
        });
      } else {
        // Return all customers.
        this.customerService.fetch(null, (err, customers) => {
          this.CustomerSerializer.render(customers, sendHttpResponse(callback));
        });
      }
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  static create(params, callback) {
    // TODO
  }

  static update(params, callback) {
    // TODO
  }

  static delete(params, callback) {
    // TODO
  }
};
