var assert = require('assert');
var Customer = require('../app/models/customer');

describe('Customer', function() {
  describe('#constructor (complete)', function() {
    it('should create a Customer object', function() {
      var customer = new Customer({
        id: "myuser@gmail.com",
        firstName: "Javier",
        lastName: "Lopez",
        phoneNumber: "3327658892",
        address: null
      });

      assert(customer instanceof Customer);
    });
  });

  describe('#constructor (partial)', function() {
    it('should create a Customer object', function() {
      var customer = new Customer({
        email: "myuser@gmail.com",
        lastName: "Lopez"
      });

      assert(customer instanceof Customer);
    });
  });


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