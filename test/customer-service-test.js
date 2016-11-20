const expect = require('chai').expect;
const Customer = require('../app/models/customer');
const CustomerService = require('../app/services/customer-service');
const ObjectNotFoundException = require("../app/exceptions/object-not-found-exception");
const ObjectExistsException = require("../app/exceptions/object-exists-exception");

describe('CustomerService', () => {
  describe('#save()', () => {
    it('should pass valid DAO parameters', (done) => {
      var mockAddress = {
        id: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64"
      };

      var mockDao = {
        persist: (key, attributes, callback) => {
          expect(key.id).to.equal("myuser@gmail.com");
          expect(attributes.id).to.equal("myuser@gmail.com");
          expect(attributes.first_name).to.equal("Javier");
          expect(attributes.last_name).to.equal("Lopez");
          expect(attributes.phone_number).to.equal("3327658892");
          expect(attributes.address_ref).to.equal("6B8C1303-CC12-4DD0-96DA-D592FB17DD64");
          expect(attributes.deleted).to.be.false;
          done();
        },
        fetch: (key, callback) => {
          callback(new ObjectNotFoundException(), null);
        }
      };

      var mockAddressSao = {
        create: (params, callback) => {
          expect(params.id).to.equal(mockAddress.id);
          callback(null, mockAddress);
        },
        show: (params, callback) => {
          expect(params.id).to.equal(mockAddress.id);
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

      var customerService = new CustomerService(mockDao, mockAddressSao);
      customerService.save(customer, done);
    });

    it('should fail when trying to save an existing customer', (done) => {
      var dbCustomer = {
        id: "myuser@gmail.com",
        first_name: "Javier",
        last_name: "Lopez",
        phone_number: "3327658892",
        address_ref: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64",
        deleted: false
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
          if (key.id === dbCustomer.id) {
            callback(null, dbCustomer);
          } else if (key.id === mockAddress.id) {
            callback(new ObjectNotFoundException());
          } else {
            callback(new Error("shouldn't get here"));
          }
        },
        persist: function(key, item, callback) {
          if (key.id === dbCustomer.id) {
            var err =  "Item Already Exists";
            callback(new ObjectExistsException(err));
          } else if (key.id === mockAddress.id) {
            callback(null, mockAddress);
          } else {
            callback(new Error("shouldn't get here"));
          }
        }
      };

      var mockAddressSao = {
        show: (params, callback) => {
          expect(params.id).to.equal(mockAddress.id);
          callback(null, mockAddress);
        },
        create: (params, callback) => {
          callback(null, mockAddress);
        }
      };

      var customerService = new CustomerService(mockDao, mockAddressSao);
      customerService.save(customer, (err, customer) => {
        console.error(err);
        expect(err).to.be.an.instanceof(ObjectExistsException);
        done();
      });
    });
  });

  describe('#update()', () => {
    it('should update the customer correctly', (done) => {
      var customer = new Customer({
        id: "myuser@gmail.com",
        firstName: "Pepe",
      });

      var oldCustomerData = {
        id: "myuser@gmail.com",
        first_name: "Javier",
        last_name: "Lopez",
        phone_number: "3327658892",
        address_ref: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64",
        deleted: false
      };

      var newCustomerData = {
        id: "myuser@gmail.com",
        first_name: "Pepe",
        last_name: "Lopez",
        phone_number: "3327658892",
        address_ref: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64",
        deleted: false
      };

      var mockAddress = {
        id: "6B8C1303-CC12-4DD0-96DA-D592FB17DD64"
      };

      var mockDao = {
        update: (key, newItem, callback) => {
          expect(key.id).to.equal("myuser@gmail.com");
          expect(newItem.first_name).to.equal("Pepe");
          callback(null, newCustomerData);
        },
        fetch: (key, callback) => {
          expect(key.id).to.equal("myuser@gmail.com");
          callback(null, oldCustomerData);
        }
      };

      var mockAddressSao = {
        show: (params, callback) => {
          expect(params.id).to.equal(mockAddress.id);
          callback(null, mockAddress);
        }
      };

      var customerService = new CustomerService(mockDao, mockAddressSao);
      customerService.update(customer, (err, customer) => {
        console.log(customer);
        done();
      });
    });
  });
});