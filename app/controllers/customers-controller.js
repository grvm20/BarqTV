'use strict';

class CustomerController {

  constructor(CustomerModel) {
    this.Customer = CustomerModel
  }

  show(searchParams, callback) {
    Customer.findBy(searchParams, callback);
  }

  create() {
    // TODO: create customer using received data.
  }
}


console.log('Loading function');

const _ = require('underscore');
const Customer = require('../models/customer');

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Initialization.
  var customerController = new CustomerController(Customer);
  var operation = event.operation;
  var params = _.omit(event, 'operation');

  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  switch (operation) {
    case 'fetch':
    case 'fetchAll':
      customerController.show(params, done)
      break;
    default:
      // Unsopported operation.
  }
};
