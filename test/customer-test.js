const _ = require('underscore');
const expect = require('chai').expect;
const InvalidInputException = require("../app/exceptions/invalid-input-exception");
const Customer = require('../app/models/customer');

function pickRandom (array) {
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

function pickModIndex (array, index) {
  return array[index%array.length];
}

const validCustomerData = {
  email: [
    "myuser@gmail.ch",
    "m.doe@hotmail.com",
    "john123@flannagan.es"
  ],
  firstName: [
    "john",
    "José Vicente",
    "Awdasodka-AwDakwdassd"
  ],
  lastName: [
    "doe",
    "Rodrigañez Martínez",
    "Mwoawodals-Awdokasas of Uawdjasi"
  ],
  phoneNumber: [
    "9291234321",
    "663823344"
  ],
  address: [
    {},
    {isValid: ()=>{return true}},
    {validate: ()=>{return true}}
  ]
}

const invalidCustomerData = {
  email: [
    "129381928",
    "michael.doe@h.o.t.m.a.i.l.com",
    "hey I am invalid@love.ch",
    "thisisweird"
  ],
  firstName: [
    "Jowa12351",
    "Felix_Juan",
    "hey#friend",
    "aokwod@asdas.com"
  ],
  lastName: [
    "lol2",
    "Crazy_Stuff",
    "<><<<<",
    "myuser@gmail.ch"
  ],
  phoneNumber: [
    "1",
    "hello",
    "myuser@gmail.ch",
    "178236781623871628736781268376123123123123123123123",
    "3.14"
  ],
  address: [
    {isValid: ()=>{return false}},
    {validate: ()=>{return false}}
  ]
};

const validCompleteCustomerDataArray = _.range(10).map(function(index) {
  return {
    id: pickModIndex(validCustomerData.email, index),
    firstName: pickModIndex(validCustomerData.firstName, index),
    lastName: pickModIndex(validCustomerData.lastName, index),
    phoneNumber: pickModIndex(validCustomerData.phoneNumber, index),
    address: pickModIndex(validCustomerData.address, index)
  };
});

const validPartialCustomerDataArray = _.range(10).map(function(index) {
  return {
    id: pickModIndex(validCustomerData.email, index),
    firstName: pickModIndex(validCustomerData.firstName, index)
  }
});;

const invalidCompleteCustomerDataArray = _.range(10).map(function(index) {
  return {
    id: pickModIndex(invalidCustomerData.email, index),
    firstName: pickModIndex(invalidCustomerData.firstName, index),
    lastName: pickModIndex(invalidCustomerData.lastName, index),
    phoneNumber: pickModIndex(invalidCustomerData.phoneNumber, index),
    address: pickModIndex(invalidCustomerData.address, index)
  }
});;



describe('Customer', () => {
  describe('#constructor', () => {

    it('should create a complete Customer object', () => {
      validCompleteCustomerDataArray.forEach((customerData) => {
        var customer = new Customer(customerData);
        expect(customer).to.be.an.instanceof(Customer);
      });
    });

    it('should create a partial Customer object', () => {
      validPartialCustomerDataArray.forEach((customerData) => {
        var customer = new Customer(customerData);
        expect(customer).to.be.an.instanceof(Customer);
      });
    });

    it('should throw an exception when invalid values are given', () => {
      invalidCompleteCustomerDataArray.forEach((customerData) => {
        expect(() => {new Customer(customerData)}).
          to.throw(InvalidInputException);
      });
    });
  });

  _.each(['firstName', 'lastName', 'phoneNumber', 'address'], (attribute) => {
    describe('#'+attribute, () => {
      it('should update its attribute value', () => {
        var customerData = validCompleteCustomerDataArray[0];
        var customer = new Customer(customerData);

        validCustomerData[attribute].forEach((newAttributeValue) => {
          customer[attribute] = newAttributeValue;
          expect(customer[attribute]).to.equal(newAttributeValue);
        });
      })

      it('should throw an exception when input is invalid', () => {
        var customerData = validCompleteCustomerDataArray[0];
        var customer = new Customer(customerData);

        invalidCustomerData[attribute].forEach((newAttributeValue) => {
          expect(()=>{customer[attribute] = newAttributeValue}).
            to.throw(InvalidInputException);
        });
      })
    });
  });

  describe('#validate()', () => {
    it('should return true when all fields are valid', () => {
      validCompleteCustomerDataArray.forEach((customerData) => {
        var customer = new Customer(customerData);
        expect(customer.validate()).to.be.true;
      });
    });

    it('should throw an exception when required fields are not present', () => {
      validPartialCustomerDataArray.forEach((customerData) => {
        var customer = new Customer(customerData);
        expect(()=>{customer.validate()}).to.throw(InvalidInputException);
      });
    });
  });
});