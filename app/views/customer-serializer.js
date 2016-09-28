'use strict';

const _ = require('underscore');

module.exports = class CustomerSerializer {
   //Change here add url 
  constructor() {}

  static render(customers, callback) {
    function renderSingleCustomer(customer) {
      return JSON.stringify({
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_ref: customer.addressRef,
        phone_number: customer.phoneNumber
      });
    }

    if (_.isArray(customers)) {
      var result = '[' + _.map(customers, renderSingleCustomer).join() + ']'
    } else {
      var result = renderSingleCustomer(customers);
    }

    callback(null, result);
  }
}
