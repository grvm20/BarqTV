'use strict';
const Address = require('../models/address');
const _ = require('underscore');
const Utils = require("../utilities/utils");

const VALID_ADDRESS_REQUIRED_ATTRIBUTES = [
  "city",
  "state",
  "apt",
  "number",
  "street",
  "zipCode"
];

/***
* Normalizer class responsible for normalizing all address inputs
***/
module.exports = class AddressNormalizer {

  constructor(addressSao) {
    this.addressSao = addressSao;
  }

  /**
  * Normalizes address
  * @address - Address to be normalized
  * @callback - Callback function to which either error or data is passed back.
  * Argument to callback expected of the form(error, data)
  **/
  normalize(address, callback) {

    Utils.validateAttributesNotEmpty(VALID_ADDRESS_REQUIRED_ATTRIBUTES, address);

    this.addressSao.fetch(address, (err, normalizedAddress) => {
      if (err) {
        callback(err);
        return;
      } else {
        callback(null, normalizedAddress);
        return;
      }
    });
  }
}
