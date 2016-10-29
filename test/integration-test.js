const _ = require('underscore');
const expect = require('chai').expect;

// Internal imports.
const injectDependencies = require('../index').injectDependencies;

describe('Smoke test:', () => {
  describe('Dependency injection', () => {
    it('should correctly inject DAO dependencies', () => {
      var graphObject = injectDependencies();
      expect(graphObject.customerDao._tableName).to.exist;
      expect(graphObject.customerDao._dynamoDocClient).to.exist;
      expect(graphObject.addressDao._tableName).to.exist;
      expect(graphObject.addressDao._dynamoDocClient).to.exist;
    });
  });
});

describe('Customer Use Cases:', () => {
  describe('Get all Customers', () => {
    it('should return all Customers when params is an empty object', (done) => {
      var params = {};
      var customersDataObjects = [{
        id: "biteme11@spn.com",
        address_ref: "85e855b5-b86c-47fa-9da9-e75ca6ab11e0",
        deleted: false,
        first_name: "Dean",
        last_name: "Winchester",
        phone_number: "9118114444",
      }, {
        id: "josruice@gmail.com",
        address_ref: "e7a02e34-371f-41f7-81f7-ca3f4be9c546",
        deleted: false,
        first_name: "Jose",
        last_name: "Ruiz",
        phone_number: "7653329876"
      }, {
        id: "api_gateway_test@gmail.com",
        address_ref: "4b9c1d76-b054-4478-ab82-75812581abd7",
        deleted: false,
        first_name: "Michael",
        last_name: "Gateway",
        phone_number: "9281234476"
      }];

      var mockCustomerDao = {
        fetch: (key, callback) => {
          expect(key).to.not.exist;
          callback(null, customersDataObjects);
        }
      };

      var graphNodes = injectDependencies(mockCustomerDao, null);
      var customersController = graphNodes.customersController;
      customersController.show(params, (err, customersData) => {
        expect(err).to.not.exist;
        for (var i = 0; i < customersDataObjects.length; ++i) {
          var customerData = customersData[i];
          var customerDataObject = customersDataObjects[i];

          expect(customerData.id).to.equal(customerDataObject.email);
          expect(customerData.address).to.equal(customerDataObject.address_ref);
          expect(customerData.first_name).to.equal(customerDataObject.first_name);
          expect(customerData.last_name).to.equal(customerDataObject.last_name);
          expect(customerData.phone_number).to.equal(customerDataObject.phone_number);
          expect(customerData.deleted).to.not.exist;
        }
        done();
      });
    });
  });

  describe('Save customer', () => {
    it('should save the Customer',
      (done) => {
        var params = {
          "last_name": "Gateway",
          "first_name": "API",
          "email": "api_gateway_test@gmail.com",
          "phone_number": "9281234476",
          "address": {
            "city": "Champaign",
            "state": "IL",
            "apt": "52",
            "street": "Main St",
            "number": "22",
            "zip_code": "68080"
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

        var mockAddressNormalizerSao = {
          fetch: (address, callback) => {
            callback(null, address);
          }
        }
        var graphNodes = injectDependencies(mockCustomerDao, mockAddressDao, mockAddressNormalizerSao);
        var customersController = graphNodes.customersController;
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
          "last_name": "Gateway",
          "first_name": "API",
          "email": "api_gateway_test@gmail.com",
          "phone_number": "9281234476",
          "address": {
            "city": "Champaign",
            "state": "IL",
            "apt": "52",
            "street": "Main St",
            "number": "22",
            "zip_code": "68080"
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

        var graphNodes = injectDependencies(mockCustomerDao, mockAddressDao);
        var customersController = graphNodes.customersController;
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
          "last_name": "",
          "first_name": "Jose",
          "email": "josruice@gmail.com",
          "phone_number": "",
          "address": {
            "city": "",
            "state": "",
            "apt": "",
            "street": "",
            "number": "",
            "zip_code": ""
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

        var mockAddressNormalizerSao = {
          fetch: (address, callback) => {
            callback(null, address);
          }
        }

        var graphNodes = injectDependencies(mockCustomerDao, mockAddressDao, mockAddressNormalizerSao);
        var customersController = graphNodes.customersController;
        customersController.update(params, (err, customer) => {
          done(err);
        });
      }
    );
  });
});

describe('Address Use Cases:', () => {
  describe('Save address', () => {
    it('should save the Address',
      (done) => {
        var params = {
          "address": {
            "city": "Las Vegas",
            "state": "NV",
            "apt": "190",
            "street": "Second Street",
            "number": "890",
            "zip_code": "43090"
          }
        }

        var mockAddressDao = {
          fetch: (key, callback) => {
            callback(null, {});
          },
          persist: (key, newItem, callback) => {
            callback(null, {
              id: "e7a32e39-371f-41f7-81f7-ca3f4be9c546",
              apt: params.apt,
              residential_city: params.city,
              deleted: false,
              building: params.number,
              residential_state: params.state,
              street: params.street,
              zip_code: params.zip_code
            });
          }
        };

        var mockAddressNormalizerSao = {
          fetch: (address, callback) => {
            callback(null, address);
          }
        }

        var graphNodes = injectDependencies(null, mockAddressDao, mockAddressNormalizerSao);
        var addressesController = graphNodes.addressesController;
        addressesController.create(params, (err, address) => {
          done(err);
        });
      }
    );
  });

  describe('Update address', () => {
    it('should update an existing Address',
      (done) => {
        var params = {
          "id": "e7a02e34-371f-41f7-81f7-ca3f4be9c546",
          "address": {
            "number": "112"
          }
        }

        var mockAddressDao = {
          fetch: (key, callback) => {
            callback(null, {
              id: "e7a02e34-371f-41f7-81f7-ca3f4be9c546",
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
            expect(newItem.building).to.equal("112");
            callback(null, {
              id: "e7a02e34-371f-41f7-81f7-ca3f4be9c546",
              apt: "52",
              residential_city: "Champaign",
              deleted: false,
              building: "112",
              residential_state: "IL",
              street: "Main St",
              zip_code: "68080"
            });
          },
          persist : (key, item, callback) => {
            callback(null, item);
          }
        };

        var mockAddressNormalizerSao = {
          fetch: (address, callback) => {
            callback(null, address);
          }
        }

        var graphNodes = injectDependencies(null, mockAddressDao, mockAddressNormalizerSao);
        var addressesController = graphNodes.addressesController;
        addressesController.update(params, (err, address) => {
          done(err);
        });
      }
    );
  });

  describe('Get all Addresses', () => {
    it('should return all Addresses when params is an empty object', (done) => {
      var params = {};
      var addressesDataObjects = [{
        id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
        apt: "N/A",
        residential_city: "Washington",
        deleted: false,
        building: "1600",
        residential_state: "DC",
        street: "Pennsylvania Ave",
        zip_code: "20500"
      }, {
        id: "41f87ef3-48bd-4721-a250-d4fa2f11afa2",
        apt: "2A",
        residential_city: "San Francisco",
        deleted: false,
        building: "550 W",
        residential_state: "CA",
        street: "Market Street",
        zip_code: "15009"
      }, {
        id: "0671d16b-a925-4526-90cb-508257192d15",
        apt: "60",
        residential_city: "Chicago",
        deleted: false,
        building: "433 N",
        residential_state: "IL",
        street: "Main St.",
        zip_code: "68155"
      }];

      var mockAddressDao = {
        fetch: (key, callback) => {
          expect(key).to.not.exist;
          callback(null, addressesDataObjects);
        }
      };

      var mockAddressNormalizerSao = {
        fetch: (address, callback) => {
          callback(null, address);
        }
      }

      var graphNodes = injectDependencies(null, mockAddressDao, mockAddressNormalizerSao);
      var addressesController = graphNodes.addressesController;
      addressesController.show(params, (err, addressesData) => {
        expect(err).to.not.exist;
        for (var i = 0; i < addressesDataObjects.length; ++i) {
          var addressData = addressesData[i];
          var addressDataObject = addressesDataObjects[i];

          expect(addressData.id).to.equal(addressDataObject.id);
          expect(addressData.city).to.equal(addressDataObject.residential_city);
          expect(addressData.state).to.equal(addressDataObject.residential_state);
          expect(addressData.apt).to.equal(addressDataObject.apt);
          expect(addressData.number).to.equal(addressDataObject.building);
          expect(addressData.street).to.equal(addressDataObject.street);
          expect(addressData.zip_code).to.equal(addressDataObject.zip_code);
        }
        done();
      });
    });
  });

  describe('Get Address by id', () => {
    it('should return an Address information given its id', (done) => {
      var addressDataObject = {
        id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
        apt: "N/A",
        residential_city: "Washington",
        deleted: false,
        building: "1600",
        residential_state: "DC",
        street: "Pennsylvania Ave",
        zip_code: "20500"
      };

      var params = {
        id: addressDataObject.id
      }

      var mockAddressDao = {
        fetch: (key, callback) => {
          expect(key.id).to.equal(addressDataObject.id);
          callback(null, addressDataObject);
        }
      };

      var mockAddressNormalizerSao = {
        fetch: (address, callback) => {
          callback(null, address);
        }
      }

      var graphNodes = injectDependencies(null, mockAddressDao, mockAddressNormalizerSao);
      var addressesController = graphNodes.addressesController;
      addressesController.show(params, (err, addressData) => {
        expect(err).to.not.exist;
        expect(addressData.id).to.equal(addressDataObject.id);
        expect(addressData.city).to.equal(addressDataObject.residential_city);
        expect(addressData.state).to.equal(addressDataObject.residential_state);
        expect(addressData.apt).to.equal(addressDataObject.apt);
        expect(addressData.number).to.equal(addressDataObject.building);
        expect(addressData.street).to.equal(addressDataObject.street);
        expect(addressData.zip_code).to.equal(addressDataObject.zip_code);
        done();
      });
    });
  });

  describe('Get Address by customer', () => {
    it('should return a Customer\'s address when her email is given', (done) => {
      var customerDataObject = {
        id: "frank_underwood@gmail.com",
        first_name: "Frank",
        last_name: "Underwood",
        phone_number: "9291234567",
        address_ref: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
        deleted: false
      };

      var addressDataObject = {
        id: "ed7888cd-30d0-4208-8491-6aa5f416c12f",
        apt: "N/A",
        residential_city: "Washington",
        deleted: false,
        building: "1600",
        residential_state: "DC",
        street: "Pennsylvania Ave",
        zip_code: "20500"
      };

      var params = {
        email: customerDataObject.id
      }

      var mockCustomerDao = {
        fetch: (key, callback) => {
          expect(key.id).to.equal(customerDataObject.id);
          callback(null, customerDataObject);
        }
      };

      var mockAddressDao = {
        fetch: (key, callback) => {
          expect(key.id).to.equal(addressDataObject.id);
          callback(null, addressDataObject);
        }
      };

      var mockAddressNormalizerSao = {
        fetch: (address, callback) => {
          callback(null, address);
        }
      }

      var graphNodes = injectDependencies(mockCustomerDao, mockAddressDao, mockAddressNormalizerSao);
      var addressesController = graphNodes.addressesController;
      addressesController.show(params, (err, addressData) => {
        expect(err).to.not.exist;
        expect(addressData.id).to.equal(addressDataObject.id);
        expect(addressData.city).to.equal(addressDataObject.residential_city);
        expect(addressData.state).to.equal(addressDataObject.residential_state);
        expect(addressData.apt).to.equal(addressDataObject.apt);
        expect(addressData.number).to.equal(addressDataObject.building);
        expect(addressData.street).to.equal(addressDataObject.street);
        expect(addressData.zip_code).to.equal(addressDataObject.zip_code);
        done();
      });
    });
  });
});
