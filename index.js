'use strict';

const _ = require('underscore');

console.log('Loading function');

const CustomersController = require('app/controllers/customers-controller');

exports.customersControllerHandler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var operation = event.operation;
  var params = _.omit(event, 'operation');

  const sendResponse = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  switch (operation) {
    case 'fetchAll':
    case 'fetch':
      CustomersController.show(params, sendResponse)
      break;
    default:
      // Unsopported operation.
  }
};