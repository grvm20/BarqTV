'use strict';

const _ = require('underscore');

module.exports = class CustomerSerializer {
  constructor() {}

  static render(customers, callback, urlprefix) {
    function renderSingleCustomer(customer) {
      return JSON.stringify({
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
        address_ref: urlprefix + '/' + "address" + '/' + customer.addressRef,
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
