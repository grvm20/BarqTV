'use strict';

const _ = require('underscore');

module.exports = class AddressSerializer {
  constructor() {}

  serialize(address) {
    return {
      id: address.id,
      city: address.residential_city,
      state: address.residential_state,
      apt: address.apt,
      building: address.building,
      street: address.street,
      zip_code: address.zipCode
    };
  }

  deserialize(object) {
    var result = {};

    if (object.id != null) {
      result.id = object.id;
    }
    if (object.city != null) {
      result.city = object.city;
    }
    if (object.residential_state != null) {
      result.residential_state = object.residential_state;
    }
    if (object.apt != null) {
      result.apt = object.apt;
    }
    if (object.building != null) {
      result.building = object.building;
    }
    if (object.street != null) {
      result.street = object.street;
    }
    if (object.zip_code != null) {
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