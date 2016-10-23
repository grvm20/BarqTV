const expect = require('chai').expect;
const Address = require('../app/models/address');
const AddressController = require('../app/controllers/addresses-controller');

describe('AddressController', () => {

  describe('#show()', () => {

    var mockAddress = new Address({
      id: "Wardrobe",
      city: "narnia",
      state: "Narnia",
      apt: "Aslan's Tow",
      number: "2",
      street: "Hill of the Stone Table",
      zipCode: "00000",
      deleted: false
    });

    var mockAddressService = {
      fetch: (key, callback) => {
        callback(null, mockAddress);
      }
    };

    var mockAddressSerializer = {

      render: (address, callback) => {
        var serialized = {
          id: address.id,
          city: address.city,
          state: address.state,
          apt: address.apt,
          number: address.number,
          street: address.street,
          zip_code: address.zipCode
        };
        callback(null, serialized);
      }
    };

    it('Should fail. Null Parameter', (done) => {

      var params = null;

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, null);
      addressService.show(params, (err, address) => {
        expect(err).to.exist;
        done();
      });
    });

    it('Should fail. Null Id', (done) => {

      var params = {};

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, null);
      addressService.show(params, (err, address) => {
        expect(err).to.exist;
        done();
      });
    });

    it('Should pass. Valid Parameter', (done) => {


      var params = {
        id: "Wardrobe"
      };

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, null);
      addressService.show(params, done);
    });


  });

  describe('#create()', () => {

    var mockAddress = {
      city: "narnia",
      state: "Narnia",
      apt: "Aslan's Tow",
      number: "2",
      street: "Hill of the Stone Table",
      zipCode: "00000"
    };

    var mockAddressService = {
      save: (attributes, callback) => {
        expect(attributes.city).to.equal("narnia");
        expect(attributes.state).to.equal("Narnia");
        expect(attributes.apt).to.equal("Aslan's Tow");
        expect(attributes.number).to.equal("2");
        expect(attributes.street).to.equal("Hill of the Stone Table");
        expect(attributes.zipCode).to.equal("00000");
        callback();
      }
    };

    var mockAddressSerializer = {

      render: (address, callback) => {
        callback(null, address);
      },
      deserialize: (object) => {
        return object;
      }
    };

    var mockAddressNormalizer = {
      normalize: (address, callback) => {
        callback(null, address);
      }
    };

    it('Should Fail. Null Parameter', (done) => {


      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.create(null, (err, createdAddress) => {
        expect(err).to.exist;
        done();
      });
    });

    it('Should Fail. Null Address', (done) => {

      var params = {};
      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.create(params, (err, createdAddress) => {
        expect(err).to.exist;
        done();
      });
    });


    it('Should pass. Valid Parameter', (done) => {

      var params = {
        address: mockAddress
      };

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.create(params, done);
    });

  });

  describe('#update()', () => {

    var mockAddress = {
      city: "narnia",
      state: "Narnia",
      apt: "Aslan's Tow",
      number: "2",
      street: "Hill of the Stone Table",
      zipCode: "00000"
    };

    var mockAddressService = {
      create: (attributes) => {
        var address = new Address();
        address.apt = "Seven Isles";
        return address;
      },
      fetch: (key, callback) => {
        callback(null, mockAddress);
      },
      save: (attributes, callback) => {
        expect(attributes.city).to.equal("narnia");
        expect(attributes.state).to.equal("Narnia");
        expect(attributes.apt).to.equal("Seven Isles");
        expect(attributes.number).to.equal("2");
        expect(attributes.street).to.equal("Hill of the Stone Table");
        expect(attributes.zipCode).to.equal("00000");
        callback();
      }
    };

    var mockAddressSerializer = {

      render: (address, callback) => {
        callback(null, address);
      },
      deserialize: (object) => {
        return object;
      }
    };

    var mockAddressNormalizer = {
      normalize: (address, callback) => {
        callback(null, address);
      }
    };

    it('Should Fail. Null Parameter', (done) => {


      var params = null;

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.update(params, (err, createdAddress) => {
        expect(err).to.exist;
        done();
      });
    });

    it('Should Fail. Null Id', (done) => {


      var params = {
        address: {
          apt: "Seven Isles"
        }
      };

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.update(params, (err, createdAddress) => {
        expect(err).to.exist;
        done();
      });
    });

    it('Should Fail. Null address', (done) => {


      var params = {
        id: "Wardrobe"
      };

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.update(params, (err, createdAddress) => {
        expect(err).to.exist;
        done();
      });
    });

    it('Should pass. Nothing to update', (done) => {

      var params = {
        id: "Wardrobe",
        address: {
          state: "Narnia"
        }
      };

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.update(params, (err, address) => {
        expect(err).to.exist;
        done();
      });
    });

    it('Should pass. Valid Parameter', (done) => {

      var params = {
        id: "Wardrobe",
        address: {
          apt: "Seven Isles"
        }
      };

      var addressService = new AddressController(mockAddressService, mockAddressSerializer, mockAddressNormalizer);
      addressService.update(params, done);
    });

  });

});
