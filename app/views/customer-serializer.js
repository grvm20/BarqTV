'use strict';

const _ = require('underscore');

const Customer = require('../models/customer');

module.exports = class CustomerSerializer {
  constructor() {}

  static render(customers, callback) {
    function renderSingleCustomer(customer) {
      return JSON.stringify(customer);
    }

    if (_.isArray(customers)) {
      var result = '[' + _.map(customers, renderSingleCustomer).join() + ']'
    } else {
      var result = renderSingleCustomer(customers);
    }

    callback(null, result);
  }
}
