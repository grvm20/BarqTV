'use strict';

const _ = require('underscore');
const Utils = require("../utilities/utils");

function areValidParams(params) {
  return _.isObject(params)
}

module.exports = class AddressSao {

  constructor(addressesController, addressSerializer) {
    this.addressesController = addressesController;
    this.addressSerializer = addressSerializer;
  }

  show(params, callback) {
    this.addressesController.show(params, callback);
  }

  create(params, callback) {
    // TODO Get rid of the envelope at some point.

    params = this.addressSerializer.serialize(params);
    var params = {
      address: params
    };
    this.addressesController.create(params, callback);
  }

  update(params, callback) {
    // TODO decide if we want to include id in the properties of PUT ot not.
    params = this.addressSerializer.serialize(params);
    var params = {
      id: params.id,
      address: _.omit(params, 'id')
    };
    this.addressesController.update(params, callback);
  }

  delete(params, callback) {
    this.addressesController.delete(params, callback);
  }
};
