const expect = require('chai').expect;
const Address = require('../app/models/address');
const AddressService = require('../app/services/address-service');
const AddressSerializer = require('../app/views/address-serializer');
const AddressesController = require('../app/controllers/addresses-controller');
const CustomersController = require('../app/controllers/customers-controller');

describe('AddressesController', () => {
  describe('#show()', () => {
    it('should return a Customer\'s address when her email is given', (done) => {
      var customerEmail = {
        email: 'forever.alone@meme.com'
      };
      var customerAddress = {
        id: 'fe91344b-1b2a-41e3-a6d7-0e40b3c68c4f',
        city: 'New New York',
        state: 'Mars (red planet)',
        apt: '1',
        number: '1',
        street: 'First St.',
        zipCode: '00001',
        deleted: false
      }

      var mockAddressService = {
        fetch: (id, callback) => {
          expect(id).to.equal(customerAddress.id);
          callback(null, customerAddress);
        }
      };
      var mockCustomersController = {
        show: (params, callback) => {
          expect(params.email).to.equal(customerEmail.email)
          callback(null, {
            address: customerAddress.id
          });
        }
      };
      var addressSerializer = new AddressSerializer();

      var addressesController = new AddressesController(
        mockAddressService,
        addressSerializer,
        mockCustomersController
      );

      addressesController.show(customerEmail, (err, addressData) => {
        expect(addressData.id).to.equal(customerAddress.id);
        expect(addressData.city).to.equal(customerAddress.city);
        expect(addressData.state).to.equal(customerAddress.state);
        expect(addressData.apt).to.equal(customerAddress.apt);
        expect(addressData.number).to.equal(customerAddress.number);
        expect(addressData.street).to.equal(customerAddress.street);
        expect(addressData.zip_code).to.equal(customerAddress.zipCode);
        done();
      });
    });
  });
});