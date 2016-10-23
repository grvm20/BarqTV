'use strict';

const _ = require('underscore');
const Utils = require("../utilities/utils");

function areValidParams(params) {
  return _.isObject(params)
}

module.exports = class AddressController {

  constructor(addressService, addressSerializer, customersController) {
    this.addressService = addressService;
    this.addressSerializer = addressSerializer;
    this.customersController = customersController;
  }

  show(params, callback) {
    var fetchAddress = (id, callback) => {
      this.addressService.fetch(id, (err, address) => {
        if (err) {
          console.log("Error fetching data for id:" + id);
          return callback(err);
        } else {
          return this.addressSerializer.render(address, callback);
        }
      });
    }

    if (areValidParams(params)) {
      if (params.id) {
        var id = params.id;
        return fetchAddress(id, callback);
      } else if (params.email) {
        // Get address of given customer email.
        this.customersController.show(params, (err, customerData) => {
          if (err) return callback(err);
          var hasAddress = customerData.address;
          if (hasAddress) {
            var addressId = customerData.address;
            return fetchAddress(addressId, callback);
          } else {
            // TODO Refactor to object not found error.
            return callback(new Exception("Address not found"));
          }
        })
      } else {
        // Get all addreses.
        return fetchAddress(null, callback);
      }
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  create(params, callback) {
    if (areValidParams(params) && areValidParams(params.address)) {
      var address = this.addressSerializer.deserialize(params.address);
      this.addressService.save(address, (err, savedAddress) => {
        if (err) {
          console.log("Error while trying to save address information: " + JSON.stringify(params.address))
          callback(err);
        } else {
          this.addressSerializer.render(savedAddress, callback);
        }
      });
    } else {
      // raise error
    }
  }

  update(params, callback) {
    var id = params.id;
    var address = params.address;
    if (!Utils.isEmpty(id) && areValidParams(address)) {
      this.addressService.update(id, address, (err, updatedAddress) => {
        if (err) {
          callback(err);
        } else {
          this.addressSerializer.render(updatedAddress, callback);
        }
      });
    } else {
      // raise error
    }
  }

  delete(params, callback) {
    if (areValidParams(params)) {
      var id = params.id;
      this.addressService.delete(id, (err, address) => {
        if (err) {
          console.log("Error while trying to delete address information for id: " + id);
          callback(err);
        } else {
          this.addressSerializer.render(address, callback);
        }
      });
    } else {
      // raise error
    }
  }
};
