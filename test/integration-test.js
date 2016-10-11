const _ = require('underscore');
const expect = require('chai').expect;

// Internal imports.
const Customer = require('../app/models/customer');
const CustomerService = require('../app/services/customer-service');
const CustomerSerializer = require('../app/views/customer-serializer');
const CustomersController = require('../app/controllers/customers-controller');

const Address = require('../app/models/address');
const AddressesController = require('../app/controllers/addresses-controller');
const AddressService = require('../app/services/address-service');
const AddressSerializer = require('../app/views/address-serializer');

// Singleton variables.
var customersController;
var addressesController;

function injectDependencies(customerDao, addressDao) {
  var addressService = new AddressService(
    addressDao
  );

  var addressSerializer = new AddressSerializer();
  var customerSerializer = new CustomerSerializer(
    addressSerializer
  );
  var customerService = new CustomerService(
    customerDao,
    addressService
  );

  // CustomersController receives a serializer class as a sort of interface.
  customersController = new CustomersController(
    customerService,
    customerSerializer
  );

  var addressSerializer = new AddressSerializer();
  addressesController = new AddressesController(
    addressService,
    addressSerializer
  );
}

describe('Customer Use Cases', () => {
  describe('Save customer', () => {
    it.only('should save the Customer',
      (done) => {
        var params = {
          "last_name" : "Gateway",
          "first_name" : "API",
          "email" : "api_gateway_test@gmail.com",
          "phone_number" : "9281234476",
          "address" : {
            "city" : "Champaign",
            "state" : "IL",
            "apt" : "52",
            "street" : "Main St",
            "number" : "22",
            "zip_code" : "68080"
          }
        }

        var mockCustomerDao = {
          fetch: (key, callback) => {
            callback(null, {});
          },
          persist: (key, newItem, callback) => {
            callback(null, {
              id: params.email,
              first_name: params.first_name,
              last_name: params.last_name,
              phone_number: params.phone_number,
              address_ref: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              deleted: false
            })
          }
        };
        var mockAddressDao = {
          fetch: (key, callback) => {
            callback(null, {
              id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              apt: params.address.apt,
              residential_city: params.address.city,
              deleted: false,
              building: params.address.number,
              residential_state: params.address.state,
              street: params.address.street,
              zip_code: params.address.zip_code
            });
          },
          persist: (key, newItem, callback) => {
            debugger;
            callback(null, {
              id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              apt: params.address.apt,
              residential_city: params.address.city,
              deleted: false,
              building: params.address.number,
              residential_state: params.address.state,
              street: params.address.street,
              zip_code: params.address.zip_code
            });
          }
        };

        injectDependencies(mockCustomerDao, mockAddressDao);
        customersController.create(params, (err, customer) => {
          // Assert staff.
          done(err);
        });
      }
    );

    it('shouldn\'t save a Customer that already exists',
      // WIP
      (done) => {
        var params = {
          "last_name" : "Gateway",
          "first_name" : "API",
          "email" : "api_gateway_test@gmail.com",
          "phone_number" : "9281234476",
          "address" : {
            "city" : "Champaign",
            "state" : "IL",
            "apt" : "52",
            "street" : "Main St",
            "number" : "22",
            "zip_code" : "68080"
          }
        }

        var mockCustomerDao = {
          fetch: (key, callback) => {
            callback(null, {
              id: params.email,
              first_name: params.first_name,
              last_name: params.last_name,
              phone_number: params.phone_number,
              address_ref: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              deleted: false
            });
          }
        };
        var mockAddressDao = {
          fetch: (key, callback) => {
            callback(null, {
              id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              apt: params.address.apt,
              residential_city: params.address.city,
              deleted: false,
              building: params.address.number,
              residential_state: params.address.state,
              street: params.address.street,
              zip_code: params.address.zip_code
            });
          },
          persist: (key, newItem, callback) => {
            callback(null, {
              id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              apt: params.address.apt,
              residential_city: params.address.city,
              deleted: false,
              building: params.address.number,
              residential_state: params.address.state,
              street: params.address.street,
              zip_code: params.address.zip_code
            });
          }
        };

        injectDependencies(mockCustomerDao, mockAddressDao);
        customersController.create(params, (err, customer) => {
          expect(err).to.exist;
          done();
        });
      }
    );
  });

  describe('Update customer', () => {
    it('should update an existing Customer (only Customer fields updated)',
      (done) => {
        var params = {
          "last_name" : "",
          "first_name" : "Jose",
          "email" : "josruice@gmail.com",
          "phone_number" : "",
          "address" : {
            "city" : "",
            "state" : "",
            "apt" : "",
            "street" : "",
            "number" : "",
            "zip_code" : ""
          }
        }

        var mockCustomerDao = {
          fetch: (key, callback) => {
            callback(null, {
              id: "josruice@gmail.com",
              first_name: "Pedro",
              last_name: "Ruiz",
              phone_number: "9291234567",
              address_ref: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              deleted: false
            });
          },
          update: (key, newItem, callback) => {
            callback(null, {
              id: "josruice@gmail.com",
              first_name: newItem.first_name,
              last_name: "Ruiz",
              phone_number: "9291234567",
              address_ref: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              deleted: false
            });
          }
        };
        var mockAddressDao = {
          fetch: (key, callback) => {
            callback(null, {
              id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              apt: "52",
              residential_city: "Champaign",
              deleted: false,
              building: "53",
              residential_state: "IL",
              street: "Main St",
              zip_code: "68080"
            });
          },
          update: (key, newItem, callback) => {
            callback(null, {
              id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
              apt: "52",
              residential_city: "Champaign",
              deleted: false,
              building: "53",
              residential_state: "IL",
              street: "Main St",
              zip_code: "68080"
            });
          }
        };

        injectDependencies(mockCustomerDao, mockAddressDao);
        customersController.update(params, (err, customer) => {
          done(err);
        });
      }
    );
  });
});