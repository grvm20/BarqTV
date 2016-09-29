var assert = require('assert');
var Customer = require('../app/models/customer');

describe('Customer', function() {
  describe('email attribute', function() {
    it('should return customer email', function() {
      var customerEmail = "josruice@gmail.com";
      var testCustomer = new Customer(
        customerEmail,
        "Jose Vicente",
        "Ruiz Cepeda",
        "DAD26CD4-C1C0-43C6-8F4C-832BDD5F96FA",
        "9291234567"
      );
      assert.equal(testCustomer.email, customerEmail);
    });
  });
});