var assert = require('assert');
var Customer = require('../app/models/customer');

describe('Customer', function() {
  describe('#email', function() {
    it('should return customer email', function() {
      var customerEmail = "josruice@gmail.com";
      var testCustomer = new Customer({
        id: customerEmail,
      });
      assert.equal(testCustomer.email, customerEmail);
    });
  });
});