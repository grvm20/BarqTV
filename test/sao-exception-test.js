var assert = require('assert');

describe('Generic SAO Exception', function() {
  describe('#basic SAO Exception', function() {
    it('should return a basic SaoException Object', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof SaoException, true);
    });
  });
});