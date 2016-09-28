'use strict';

const _ = require('underscore');

console.log('Loading function');

const CustomersController = require('app/controllers/customers-controller');

exports.customersControllerHandler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var operation = event.operation;
  var params = _.omit(event, 'operation');

  switch (operation) {
    case 'fetchAll':
    case 'fetch':
      CustomersController.show(params, callback)
      break;
    default:
      // Unsopported operation.
  }
};