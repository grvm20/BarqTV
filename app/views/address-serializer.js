'use strict';

const _ = require('underscore');
const Utils = require('../utilities/utils');

module.exports = class AddressSerializer {
  constructor() {}

  serialize(address) {
    return {
      id: address.id,
      city: address.city,
      state: address.state,
      apt: address.apt,
      number: address.number,
      street: address.street,
      zip_code: address.zipCode
    };
  }

  deserialize(object) {
    var result = {};
    if (!Utils.isEmpty(object.id)) {
      result.id = object.id;
    }
    if (!Utils.isEmpty(object.city)) {
      result.city = object.city;
    }
    if (!Utils.isEmpty(object.state)) {
      result.state = object.state;
    }
    if (!Utils.isEmpty(object.apt)) {
      result.apt = object.apt;
    }
    if (!Utils.isEmpty(object.number)) {
      result.number = object.number;
    }
    if (!Utils.isEmpty(object.street)) {
      result.street = object.street;
    }
    if (!Utils.isEmpty(object.zip_code)) {
      result.zipCode = object.zip_code;
    }

    return result;
  }

  render(addresses, callback) {
    if (_.isArray(addresses)) {
      var result = [];
      _.each(addresses, (el) => {
        result.push(this.serialize(el));
      })
    } else {
      var result = this.serialize(addresses);
    }
    callback(null, result);
  }
}