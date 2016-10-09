'use strict';

const _ = require('underscore');

module.exports = class CustomerSerializer {
  constructor(addressSerializer) {
    this.addressSerializer = addressSerializer;
  }

  serialize(customer) {
    return {
      email: customer.email,
      first_name: customer.firstName,
      last_name: customer.lastName,
      address: customer.addressRef,
      phone_number: customer.phoneNumber
    };
  }

  deserialize(object) {
    var result = {};

    if (object.email != null) {
      result.email = object.email;
    }
    if (object.first_name != null) {
      result.firstName = object.first_name;
    }
    if (object.last_name != null) {
      result.lastName = object.last_name;
    }
    if (object.address_ref != null) {
      result.addressRef = object.address_ref;
    }
    if (object.phone_number != null) {
      result.phoneNumber = object.phone_number;
    }
    if (object.address != null) {
      result.address = this.addressSerializer.deserialize(object.address);
    }

    return result;
  }

  render(customers, callback) {
    if (_.isArray(customers)) {
      var result = [];
      _.each(customers, (el) => {
        result.push(this.serialize(el));
      })
    } else {
      var result = this.serialize(customers);
    }

    callback(null, result);
  }
}
