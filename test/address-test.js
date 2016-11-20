const expect = require('chai').expect;
const InvalidInputException = require("../app/exceptions/invalid-input-exception");
const Address = require('../app/models/address');

describe('Address', () => {
  describe('#constructor', () => {
    it('should validate and return an Address instance', () => {
      var testAddress = new Address({
        id: "12345678",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      expect(testAddress).to.be.an.instanceof(Address);
    });
  });

  describe('#validate()', () => {
    it('should return true when the address is complete and valid', () => {
      var validAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      });

      expect(validAddress.validate()).to.be.true;
    });

    it('should throw an exception when the address is incomplete', () => {
      var incompleteAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        state: "NY",
        apt: "29",
        street: "Tiemann Pl.",
        zipCode: "10027"
      });

      expect(() => { incompleteAddress.validate() }).to.throw(InvalidInputException);
    });
  });
});