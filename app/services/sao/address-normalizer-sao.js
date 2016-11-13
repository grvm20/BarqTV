'use strict';

const _ = require('underscore');
const sprintf = require('sprintf-js').sprintf;
const Utils = require("../../utilities/utils");
const AddressInvalidException = require('../../exceptions/address-invalid-exception');
const AddressNotSpecificException = require('../../exceptions/address-not-specific-exception');
/***
* Address SAO class which handes service call for any address related operations
* Supports HTTPS. Expects host, authentication Id, authetication token and https object
***/
module.exports = class AddressNormalizerSao {

  constructor(host, authId, authIdToken, https) {
    this.host = host;
    this.authId = authId;
    this.authIdToken = authIdToken;
    this.https = https;
  }

  /**
  * Fetches address from service for the given address
  * @address - Address for which service needs to be called
  * @callback - Callback function to which either error or data is passed back.
  * Argument to callback expected of the form(error, data)
  **/
  fetch(address, callback) {
    // API expects street to be a combination of number, street and apartment
    var street = address.number + ' ' + address.street + ' ' + address.apt;

    var path = '/street-address?auth-id=' + encodeURIComponent(this.authId) + '&auth-token=' 
    + encodeURIComponent(this.authIdToken) + '&street=' + encodeURIComponent(street) 
    + '&city=' + encodeURIComponent(address.city) + '&state=' + encodeURIComponent(address.state) + '&candidates=10'

    var options = {
      host: this.host,
      path: path
    }
    this.https.get(options, function(res) {

      console.log("Response Status Code: " + res.statusCode);

      res.on("data", function(chunk) {

        console.log("BODY: " + chunk);

        var body = JSON.parse(chunk);
        var sizeOfBody = _.size(body);
        if (sizeOfBody == 0 ) {
          return callback(new AddressInvalidException("No such address exists"));
        }
        if(sizeOfBody > 1){
          return callback(new AddressNotSpecificException("Address is not specific enough"));
        }

        var addressData = body[0];
        var addressDataComponents = addressData["components"];

        var normalizedAddress = {};
        normalizedAddress.id = addressData["delivery_point_barcode"];

        normalizedAddress.city = addressDataComponents["city_name"];
        normalizedAddress.zipCode = addressDataComponents["zipcode"];
        normalizedAddress.state = addressDataComponents["state_abbreviation"];

        // Set Street
        var street = addressDataComponents["street_name"];
        var street_suffix = addressDataComponents["street_suffix"];
        if (!Utils.isEmpty(street_suffix)) {
          street = street + " " + street_suffix;
        }
        normalizedAddress.street = street;

        // Set Apartment
        var secondary_designator = addressDataComponents["secondary_designator"];
        var apt = addressDataComponents["secondary_number"];
        if (!Utils.isEmpty(secondary_designator)) {
          apt = secondary_designator + " " + apt;
        }
        normalizedAddress.apt = apt;

        // Set Number
        var number = addressDataComponents["primary_number"];
        var street_predirection = addressDataComponents["street_predirection"];
        if (!Utils.isEmpty(street_predirection)) {
          number = number + " " + street_predirection;
        }
        normalizedAddress.number = number;

        // TODO: implement proper error handling for the case when the address
        // doesn't exist in SmartyStreet.
        return callback(null, normalizedAddress);

      });
    }).on('error', function(e) {
      console.log("Error while trying to call addresses service: " + e.message);
      callback(e);
      return;
    });
  }
};
