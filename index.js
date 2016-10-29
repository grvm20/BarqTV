'use strict';

// Vendor imports.
const _ = require('underscore');
const AWS = require('aws-sdk');
const HTTPS = require('https');

// Internal imports.
const Dao = require('./app/services/dao/dao');
const AddressSao = require('./app/services/address-sao');

const CustomerService = require('./app/services/customer-service');
const CustomerSerializer = require('./app/views/customer-serializer');
const CustomersController = require('./app/controllers/customers-controller');

const AddressesController = require('./app/controllers/addresses-controller');
const AddressService = require('./app/services/address-service');
const AddressSerializer = require('./app/views/address-serializer');
const AddressNormalizer = require('./app/normalizers/address-normalizer');
const AddressNormalizerSao = require('./app/services/sao/address-normalizer-sao');

// Constants.
const CUSTOMERS_TABLE_NAME = 'customers';
const ADDRESSES_TABLE_NAME = 'addresses';
const ADDRESS_SAO_HOST = 'us-street.api.smartystreets.com';
const ADDRESS_SAO_AUTH_ID = '10d3d858-072e-fdf3-0c44-a669f2cca11e';
const ADDRESS_SAO_AUTH_ID_TOKEN = '0gaJxoGO4b3btMZf7X3v';

// Singleton variables.
var dynamoDocClient;

var customerDao;
var customerService;
var customerSerializer;
var customersController;

var addressDao;
var addressNormalizerSao;
var addressNormalizer;
var addressService;
var addressSerializer;
var addressesController;
var addressSao;


// Functions.
function sendHttpResponse(callback) {
  return (err, body) => {
    var statusCode = '200';
    var body = body;
    if (err) {
      statusCode = '400';
      body = err.message;
      console.error(err);
    }

    callback(null, {
      statusCode: statusCode,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  };
};

const injectDependencies = (customCustomerDao, customAddressDao, customAddressNormalizeSao) => {
  console.log('Injecting dependencies.');
  dynamoDocClient = new AWS.DynamoDB.DocumentClient();
  addressSao = new AddressSao({});

  if (typeof customCustomerDao !== 'undefined') {
    customerDao = customCustomerDao
  } else {
    customerDao = new Dao(dynamoDocClient, CUSTOMERS_TABLE_NAME);
  }

  if (typeof customAddressDao !== 'undefined') {
    addressDao = customAddressDao
  } else {
    addressDao = new Dao(dynamoDocClient, ADDRESSES_TABLE_NAME);
  }

  if( typeof customAddressNormalizeSao !== 'undefined') {
    addressNormalizerSao = customAddressNormalizeSao;
  }else{
    addressNormalizerSao = new AddressNormalizerSao(ADDRESS_SAO_HOST, ADDRESS_SAO_AUTH_ID, ADDRESS_SAO_AUTH_ID_TOKEN, HTTPS);
  }

  addressSerializer = new AddressSerializer();
  addressNormalizer = new AddressNormalizer(addressNormalizerSao);

  addressService = new AddressService(
    addressDao,
    addressNormalizer,
    addressSerializer
  );

  addressSerializer = new AddressSerializer();
  customerSerializer = new CustomerSerializer(
    addressSerializer
  );
  customerService = new CustomerService(
    customerDao,
    addressSao
  );

  // CustomersController receives a serializer class as a sort of interface.
  customersController = new CustomersController(
    customerService,
    customerSerializer
  );

  addressesController = new AddressesController(
    addressService,
    addressSerializer,
    customersController
  );

  // Add real values to the SAOs at the end, to overcome circular dependencies.
  addressSao.addressesController = addressesController;
  addressSao.addressSerializer = addressSerializer;

  console.log('Dependencies injected.');
  return {addressDao, addressesController, addressSao, addressSerializer,
    addressSerializer, addressService, customerDao, customersController,
    customerSerializer, customerService}
}
exports.injectDependencies = injectDependencies;


exports.customersControllerHandler = (event, context, callback) => {
  injectDependencies();
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
      customersController.show(params, sendHttpResponse(callback))
      break;
    case 'create':
      customersController.create(params, sendHttpResponse(callback))
      break;
    case 'update':
      customersController.update(params, sendHttpResponse(callback))
      break;
    case 'delete':
      customersController.delete(params, sendHttpResponse(callback))
      break;
    default:
      // Unsupported operation.
  }
};


exports.addressesControllerHandler = (event, context, callback) => {
  injectDependencies();
  console.log('Received event:', JSON.stringify(event, null, 2));

  if (event.operation) {
    var operation = event.operation;
  } else {
    // Raise error and return.
  }

  var params = _.omit(event, 'operation');

  switch (operation) {
    case 'fetch':
      addressesController.show(params, sendHttpResponse(callback))
      break;
    case 'create':
      addressesController.create(params, sendHttpResponse(callback))
      break;
    case 'update':
      addressesController.update(params, sendHttpResponse(callback))
      break;
    case 'delete':
      addressesController.delete(params, sendHttpResponse(callback))
      break;
    default:
      // Unsupported operation.
  }
};
