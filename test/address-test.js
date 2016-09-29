var assert = require('assert');
var Address = require('../app/models/address');

describe('Address', function() {
  describe('#constructor', function() {
    it('should validate and return an Address instance', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof Address, true);
    });
  });
});