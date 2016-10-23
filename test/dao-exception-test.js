const expect = require('chai').expect;
const Address = require('../app/models/address');
const AddressController = require('../app/controllers/addresses-controller');
const DaoException = require('../app/exceptions/dao-exception')
const DataObjectErrorException = require('../app/exceptions/dao-object-error-exception')
const MethodNotAllowedException = require('../app/exceptions/method-not-allowed-exception')
const ObjectExistsException = require('../app/exceptions/object-exists-exception')
const ObjectNotFoundException = require('../app/exceptions/object-not-found-exception')


describe('DAO Exception Testing', () => {
   
  describe('#basic DAO Exception', function() {
    it('should return a Generic DAO Exception', function() {
      var testAddress = new Address({
        id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
        city: "New York",
        state: "NY",
        apt: "29",
        number: "55",
        street: "Tiemann Pl.",
        zipCode: "10027"
      })
      assert.equal(testAddress instanceof DaoException, true);
    }) };

    describe('#Data Object Exception error', () => {

      it('should return a DataObjectErrorException - Object Not Found', expect ( () => {
            var testAddress = new Address({
            id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
            city: "New York",
            state: "NY",
            apt: "29",
            number: "55",
            street: "Tiemann Pl.",
            zipCode: "10027"
          })
        }).to.throw( DataObjectErrorException )) } );

    describe('#Method not allowed DAO Exception', () => {

      it('should return a Method Not Allowed DAO Exception', expect ( () => {
            var testAddress = new Address({
            id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
            city: "New York",
            state: "NY",
            apt: "29",
            number: "55",
            street: "Tiemann Pl.",
            zipCode: "10027"
          })
        }).to.throw( MethodNotAllowedException )) } );

    describe('#Object Exists Exception', () => {

      it('should return a ObjectExistsException', expect ( () => {
            var testAddress = new Address({
            id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
            city: "New York",
            state: "NY",
            apt: "29",
            number: "55",
            street: "Tiemann Pl.",
            zipCode: "10027"
          })
        }).to.throw( ObjectExistsException )) } );

    describe('#Object Exists Exception', () => {

      it('#Object Not Found Exception', expect ( () => {
            var testAddress = new Address({
            id: "14D81EF1-A564-4378-8559-6BE3D3A36154",
            city: "New York",
            state: "NY",
            apt: "29",
            number: "55",
            street: "Tiemann Pl.",
            zipCode: "10027"
          })
        }).to.throw(ObjectNotFoundException) ) } );
});