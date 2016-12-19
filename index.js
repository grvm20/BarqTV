'use strict';

const APP_PATH = './app';

// Vendor imports.
const AWS = require('aws-sdk');
const HTTPS = require('https');

// Internal imports.
const Utils = require(`${APP_PATH}/utilities/utils`);
const InvalidInputException = require(`${APP_PATH}/exceptions/` +
  `invalid-input-exception`);

const Dao = require(`${APP_PATH}/services/dao/dao`);
const AddressSao = require(`${APP_PATH}/services/address-sao`);

const CustomerService = require(`${APP_PATH}/services/customer-service`);
const CustomerSerializer = require(`${APP_PATH}/views/customer-serializer`);
const CustomersController = require(`${APP_PATH}/controllers/customers-controller`);

const AddressesController = require(`${APP_PATH}/controllers/addresses-controller`);
const AddressService = require(`${APP_PATH}/services/address-service`);
const AddressSerializer = require(`${APP_PATH}/views/address-serializer`);
const AddressNormalizer = require(`${APP_PATH}/normalizers/address-normalizer`);
const AddressNormalizerSao = require(`${APP_PATH}/services/sao/address-normalizer-sao`);

const CommentService = require(`${APP_PATH}/services/comment-service`);
const CommentSerializer = require(`${APP_PATH}/views/comment-serializer`);
const CommentsController = require(`${APP_PATH}/controllers/comments-controller`);

// Constants.
const CUSTOMERS_TABLE_NAME = 'customers';
const ADDRESSES_TABLE_NAME = 'addresses';
const COMMENTS_TABLE_NAME = 'comments';
const COMMENTS_INDEX_NAME = 'content_ref-index';
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

var commentDao;
var commentService;
var commentSerializer;
var commentsController;


// Mapping to Error codes
var mapping = require('./error-mapping');

const injectDependencies = (customObjects) => {
  console.log('Injecting dependencies.');
  if (!customObjects) customObjects = {};
  dynamoDocClient = new AWS.DynamoDB.DocumentClient();

  // DAOs
  customerDao = customObjects.customerDao ? customObjects.customerDao :
    new Dao(dynamoDocClient, CUSTOMERS_TABLE_NAME);

  addressDao = customObjects.addressDao ? customObjects.addressDao :
    new Dao(dynamoDocClient, ADDRESSES_TABLE_NAME);

  addressNormalizerSao = customObjects.addressNormalizerSao ?
    customObjects.addressNormalizerSao : new AddressNormalizerSao(
    ADDRESS_SAO_HOST, ADDRESS_SAO_AUTH_ID, ADDRESS_SAO_AUTH_ID_TOKEN, HTTPS);

  commentDao = customObjects.commentDao ? customObjects.commentDao :
    new Dao(dynamoDocClient, COMMENTS_TABLE_NAME, COMMENTS_INDEX_NAME);

  // Serializers and normalizers.
  addressSerializer = new AddressSerializer();
  addressNormalizer = new AddressNormalizer(addressNormalizerSao);

  customerSerializer = new CustomerSerializer(
    addressSerializer
  );

  commentSerializer = new CommentSerializer();

  // SAOs and other services.
  addressSao = new AddressSao({});

  addressService = new AddressService(
    addressDao,
    addressNormalizer,
    addressSerializer
  );

  customerService = new CustomerService(
    customerDao,
    addressSao
  );

  commentService = new CommentService(
    commentDao
  );

  // Controllers.
  customersController = new CustomersController(
    customerService,
    customerSerializer
  );

  addressesController = new AddressesController(
    addressService,
    addressSerializer,
    customersController
  );

  commentsController = new CommentsController(
    commentService,
    commentSerializer
  );

  // Add real values to the SAOs at the end, to overcome circular dependencies.
  addressSao.addressesController = addressesController;
  addressSao.addressSerializer = addressSerializer;

  console.log('Dependencies injected.');
  return {
    addressDao,
    addressesController,
    addressSao,
    addressSerializer,
    addressService,

    customerDao,
    customersController,
    customerSerializer,
    customerService,

    commentDao,
    commentsController,
    commentSerializer,
    commentService
  }
}
exports.injectDependencies = injectDependencies;

function extractOperationAndParams(event, callback) {
  console.log('Received event:`', JSON.stringify(event, null, 2));
  if (event.operation) {
    var operation = event.operation;
    var params = Utils.omit(event, 'operation');
    callback(null, operation, params);
  } else if (event.Records) {
    var records = event.Records;
    for (let record of event.Records) {
      if (record.Sns) {
        console.log("Received SNS event", record.Sns.Message);
        var message = JSON.parse(record.Sns.Message);
        extractOperationAndParams(message, callback);
      }
    }
  } else {
    callback(new InvalidInputException('An operation has to be specified.'));
  }
}

function callController(event, controllerName, callback) {
  var objectsGraph = injectDependencies();
  var controller = objectsGraph[controllerName];
  extractOperationAndParams(event, (err, operation, params) => {
    switch (operation) {
      case 'fetchAll':
      case 'fetch':
        controller.show(params, mapping.sendHttpResponse(callback));
        break;
      case 'create':
        controller.create(params, mapping.sendHttpResponse(callback));
        break;
      case 'update':
        controller.update(params, mapping.sendHttpResponse(callback));
        break;
      case 'delete':
        controller.delete(params, mapping.sendHttpResponse(callback));
        break;
      default:
        mapping.sendHttpResponse(callback)(new InvalidInputException(
          'Invalid operation "${operation}" given.'));
    }
  });
}

exports.customersControllerHandler = (event, context, callback) => {
  callController(event, 'customersController', callback);
};

exports.addressesControllerHandler = (event, context, callback) => {
  callController(event, 'addressesController', callback);
};

exports.commentsControllerHandler = (event, context, callback) => {
  callController(event, 'commentsController', callback);
};
