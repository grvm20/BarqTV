'use strict';

const _ = require('underscore');

module.exports = class AddressSerializer {
  constructor() {}

  serialize(address) {
    return {
      id: address.id,
      city: address.city,
      state: address.state,
      apt: address.apt,
      building: address.building,
      street: address.street,
      zip_code: address.zipCode
    };
  }

  deserialize(object) {
    var result = {};

    if (object.id) {
      result.id = object.id;
    }
    if (object.city) {
      result.city = object.city;
    }
    if (object.state) {
      result.state = object.state;
    }
    if (object.apt) {
      result.apt = object.apt;
    }
    if (object.building) {
      result.building = object.building;
    }
    if (object.street) {
      result.street = object.street;
    }
    if (object.zip_code) {
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