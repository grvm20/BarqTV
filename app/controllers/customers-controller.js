'use strict';

const _ = require('underscore');
const sprintf = require('sprintf-js').sprintf;

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
            console.error(err);
            return callback(err);
          } else {
            this.customerSerializer.render(customer, callback);
          }
        });
      } else {
        // Return all customers.
        this.customerService.fetch(null, (err, customers) => {
          if (err) {
            console.error(err);
            return callback(err);
          } else if (_.isEmpty(customers)) {
            callback(null, {});
          } else {
            this.customerSerializer.render(customers, callback);
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
      this.buildCustomerFromParams(params, (err, customer) => {
        if (err) {
          console.error(err);
          return callback(err);
        } else {
          this.customerService.save(customer, (err, savedCustomer) => {
            if (err) {
                console.error(err);
                return callback(err);
              } else {
                this.customerSerializer.render(savedCustomer, callback);
              }
          });
        }
      });
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  update(params, callback) {
    if (areValidParams(params)) {
      this.buildCustomerFromParams(params, (err, customer) => {
        if (err) {
          console.error(err);
          return callback(err);
        } else {
          this.customerService.update(customer, (err, updatedCustomer) => {
            if (err) {
                console.error(err);
                return callback(err);
              } else {
                this.customerSerializer.render(updatedCustomer, callback);
              }
          });
        }
      });
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  delete(params, callback) {
    if (areValidParams(params)) {
      this.buildCustomerFromParams(params, (err, customer) => {
        if (err) {
          console.error(err);
          return callback(err);
        } else {
          this.customerService.delete(customer, (err, deletedCustomer) => {
            if (err) {
                console.error(err);
                return callback(err);
              } else {
                this.customerSerializer.render(deletedCustomer, callback);
              }
          });
        }
      });
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  buildCustomerFromParams(params, callback) {
    var customerAttributes = this.customerSerializer.deserialize(params);

    console.log(sprintf("Customer attributes received %s.",
      JSON.stringify(customerAttributes)));

    try {
      var customer = this.customerService.create(customerAttributes);
    } catch (err) {
      console.error(err);
      return callback(err);
    }

    console.log(sprintf("Customer object created %s.", JSON.stringify(customer)));
    callback(null, customer);
  }
};
