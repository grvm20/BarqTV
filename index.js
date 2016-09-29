'use strict';

// Vendor imports.
const _ = require('underscore');

// Internal imports.
const Dao = require('./app/services/dao/dao');

const Customer = require('./app/models/customer');
const CustomerService = require('./app/services/customer-service');
const CustomerSerializer = require('./app/views/customer-serializer');
const CustomersController = require('./app/controllers/customers-controller');

const Address = require('./app/models/address');
const AddressService = require('./app/services/address-service');
const AddressSerializer = require('./app/views/address-serializer');
// const AddressesController = require('./app/controllers/addresses-controller');

// Constants.
const CUSTOMERS_TABLE_NAME = 'customers';
const ADDRESSES_TABLE_NAME = 'addresses';

// Singleton variables.
var customerDao;
var customerService;
var customerSerializer;
var customersController;

var addressDao;
var addressService;
var addressSerializer;
var addressesController;


// Functions.
function injectDependencies() {
  console.log('Injecting dependencies.');
  customerDao = new Dao(CUSTOMERS_TABLE_NAME);
  addressDao = new Dao(ADDRESSES_TABLE_NAME);

  addressService = new AddressService(
    addressDao  
  );

  addressSerializer = new AddressSerializer();
  customerSerializer = new CustomerSerializer(
    addressSerializer
  );
  customerService = new CustomerService(
    customerDao,
    addressService
  );

  // CustomersController receives a serializer class as a sort of interface.
  customersController = new CustomersController(
    customerService,
    customerSerializer
  );
  // addressesController = new AddressesController(
  //   addressService,
  //   addressSerializer
  // );

  console.log('Dependencies injected.');
}
injectDependencies();

exports.customersControllerHandler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (event.operation) {
    var operation = event.operation;
  } else {
    // Raise error and return.
  }
  
  var params = _.omit(event, 'operation');
  if (params.customer) {
    params = params.customer;
  }

  switch (operation) {
    case 'fetchAll':
    case 'fetch':
      customersController.show(params, callback)
      break;
    case 'create':
      customersController.create(params, callback)
      break;
    case 'update':
      customersController.update(params, callback)
      break;
    case 'delete':
      customersController.delete(params, callback)
      break;
    default:
      // Unsopported operation.
  }
};

// customersController.show({email: "josruice@gmail.com"}, ()=>{})
