'use strict';

// Comment these two lines to execute tests.
// TODO: Get database connection out of here.
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

module.exports = class Customer {
  constructor(email, first_name, last_name, address_ref, phone_number) {
    this.email = email;
    this.first_name = first_name;
    this.last_name = last_name;
    this.address_ref = address_ref;
    this.phone_number = phone_number;
  }

  // If no params are given, it will return all customers.
  static findBy(params, callback) {
    dynamo.scan(
      {TableName: "customers"}, 
      (err, res) => {
        if (err) {
          // Something went wrong. Throw exception.
          callback(err);
        } else {
          callback(null, res);
        }
      }
    );
  }
}
