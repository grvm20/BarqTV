var assert = require('assert');

describe('Generic DAO Exception', function() {
  describe('#basic DAO Exception', function() {
    it('should return a Generic DAO Exception', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof DaoException, true);
    });

    describe('#Data Object Exception error', function() {
    it('should return a DataObjectErrorException - Object Not Found', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof DataObjectErrorException, true);
    });

    describe('#Method not allowed DAO Exception', function() {
    it('should return a Method Not Allowed DAO Exception', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof MethodNotAllowedException, true);
    });

    describe('#Object Exists Exception', function() {
    it('should return a ObjectExistsException', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof ObjectExistsException, true);
    });

    describe('#Object Not Found Exception', function() {
    it('should return a ObjectNotFoundException', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof ObjectNotFoundException, true);
    });

  });
});