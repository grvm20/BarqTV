var assert = require('assert');
var Customer = require('../app/models/customer');
var CustomerService = require('../app/services/customer-service');

describe('CustomerService', function() {
  describe('#save()', function() {
    it('should pass valid DAO parameters', function(done) {
      var mockAddress = {
        id: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64"
      };

      var mockDao = {
        persist: (key, attributes, callback) => {
          assert.equal("myuser@gmail.com", key.id);
          assert.equal("myuser@gmail.com", attributes.id);
          assert.equal("Javier", attributes.first_name);
          assert.equal("Lopez", attributes.last_name);
          assert.equal("3327658892", attributes.phone_number);
          assert.equal("6B8C1303-CC12-4DD0-96DA-D592FB17DD64",
            attributes.address_ref);
          assert.equal(false, attributes.deleted);
          done();
        },
        fetch: (key, callback) => {
          callback(null, {});
        }
      };

      var mockAddressService = {
        save: (address, callback) => {
          callback(null, mockAddress);
        },
        fetch: (key, callback) => {
          callback(null, mockAddress);
        }
      };

      var customer = new Customer({
        id: "myuser@gmail.com",
        firstName: "Javier",
        lastName: "Lopez",
        phoneNumber: "3327658892",
        address: mockAddress
      });

      var customerService = new CustomerService(mockDao, mockAddressService);
      customerService.save(customer, done);
    });

    it('should fail when trying to save an existing customer', function(done) {
      var dbCustomer = {
        id: "myuser@gmail.com",
        first_name: "Javier",
        last_name: "Lopez",
        phone_number: "3327658892",
        address_ref: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64"
      };

      var mockAddress = {
        id: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64"
      };

      var customer = new Customer({
        id: "myuser@gmail.com",
        firstName: "Javier",
        lastName: "Lopez",
        phoneNumber: "3327658892",
        address: mockAddress
      });

      var mockDao = {
        fetch: function(key, callback) {
          callback(null, dbCustomer);
        }
      };

      var mockAddressService = {
        fetch: function(address, callback) {
          callback(null, mockAddress);
        }
      };

      var customerService = new CustomerService(mockDao, mockAddressService);
      customerService.save(customer, (err, customer) => {
        console.log(err);
        assert(err);
        done();
      });
    });
  });
});