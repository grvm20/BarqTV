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
  constructor(customerService, customerSerializer) {
    this.customerService = customerService;
    this.customerSerializer = customerSerializer;
  }


  show(params, callback) {
    if (areValidParams(params)) {
      var containsEmail = _.isString(params.email);

      if (containsEmail) {
        var email = params.email;
        this.customerService.fetch(email, (err, customer) => {
          if (err) {
            callback(err);
          } else {
            this.customerSerializer.render(customer, sendHttpResponse(callback));
          }
        });
      } else {
        // Return all customers.
        this.customerService.fetch(null, (err, customers) => {
          if (err) {
            callback(err);
          } else {
            this.customerSerializer.render(customers, sendHttpResponse(callback));
          }
        });
      }
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  create(params, callback) {
    if (areValidParams(params)) {
      try {
        var customerAttributes = this.customerSerializer.deserialize(params);
        var customer = this.customerService.create(customerAttributes);
      } catch(err) {
        callback(err);
      }

      this.customerService.save(customer, (err, customer) => {
        if (err) {
            callback(err);
          } else {
            this.customerSerializer.render(customer, sendHttpResponse(callback));
          }
      });
      
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  update(params, callback) {
    // TODO
  }

  delete(params, callback) {
    // TODO
  }
};
