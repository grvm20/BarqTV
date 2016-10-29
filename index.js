'use strict';

// Vendor imports.
const _ = require('underscore');
const AWS = require('aws-sdk');
const DYNAMO_DOC_ClIENT = new AWS.DynamoDB.DocumentClient();
const HTTPS = require('https');

// Internal imports.
const Dao = require('./app/services/dao/dao');
const AddressSao = require('./app/services/sao/address-sao');

const CustomerService = require('./app/services/customer-service');
const CustomerSerializer = require('./app/views/customer-serializer');
const CustomersController = require('./app/controllers/customers-controller');

const AddressesController = require('./app/controllers/addresses-controller');
const AddressService = require('./app/services/address-service');
const AddressSerializer = require('./app/views/address-serializer');
const AddressNormalizer = require('./app/normalizers/address-normalizer');

// Constants.
const CUSTOMERS_TABLE_NAME = 'customers';
const ADDRESSES_TABLE_NAME = 'addresses';
const ADDRESS_SAO_HOST = 'us-street.api.smartystreets.com';
const ADDRESS_SAO_AUTH_ID = '10d3d858-072e-fdf3-0c44-a669f2cca11e';
const ADDRESS_SAO_AUTH_ID_TOKEN = '0gaJxoGO4b3btMZf7X3v';

// Singleton variables.
var customerDao;
var customerService;
var customerSerializer;
var customersController;

var addressDao;
var addressSao;
var addressNormalizer;
var addressService;
var addressSerializer;
var addressesController;

// Mapping to Error codes
var mapping = require('./error-mapping');

// Functions.

const injectDependencies = (customCustomerDao, customAddressDao, customAddressNormalizeSao) => {
  console.log('Injecting dependencies.');
  customerDao = new Dao(CUSTOMERS_TABLE_NAME, DYNAMO_DOC_ClIENT);
  addressDao = new Dao(ADDRESSES_TABLE_NAME, DYNAMO_DOC_ClIENT);

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

  addressSao = new AddressSao(ADDRESS_SAO_HOST, ADDRESS_SAO_AUTH_ID, ADDRESS_SAO_AUTH_ID_TOKEN, HTTPS);
  addressNormalizer = new AddressNormalizer(addressSao);
  addressSerializer = new AddressSerializer();
  addressesController = new AddressesController(
    addressService,
    addressSerializer,
    addressNormalizer
  );

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
      customersController.show(params, mapping.sendHttpResponse(callback))
      break;
    case 'create':
      customersController.create(params, mapping.sendHttpResponse(callback))
      break;
    case 'update':
      customersController.update(params, mapping.sendHttpResponse(callback))
      break;
    case 'delete':
      customersController.delete(params, mapping.sendHttpResponse(callback))
      break;
    default:
      // Unsupported operation.
  }
};

exports.addressesControllerHandler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (event.operation) {
    var operation = event.operation;
  } else {
    // Raise error and return.
  }

  var params = _.omit(event, 'operation');

  switch (operation) {
    case 'fetch':
      addressesController.show(params, mapping.sendHttpResponse(callback))
      break;
    case 'create':
      addressesController.create(params, mapping.sendHttpResponse(callback))
      break;
    case 'update':
      addressesController.update(params, mapping.sendHttpResponse(callback))
      break;
    case 'delete':
      addressesController.delete(params, mapping.sendHttpResponse(callback))
      break;
    default:
      // Unsupported operation.
  }
};