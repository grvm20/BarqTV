const expect = require('chai').expect;
const Dao = require('../app/services/dao/dao');

describe.skip('Dao', () => {
  describe('#persist()', () => {
    it('should persist the given item if the key doesn\'t exist', (done) => {});
    it('should throw an exception if the given key already exists', (done) => {});
    it('should throw an exception if the database client fails', (done) => {});
  });

  describe('#fetch()', () => {
    it('should return all non-deleted items if no key is given', (done) => {});
    it('should return the item with the given key if it exists and is not deleted', (done) => {});
    it('should return an empty object if the item doesn\'t exist', (done) => {});
    it('should return an empty object if the item exists but is deleted', (done) => {});
    it('should throw an exception if the database client fails', (done) => {});
  });

  describe('#delete()', () => {
    it('should mark the item as deleted and return it if it exists and is not deleted', (done) => {});
    it('should throw an exception if the item doesn\'t exist', (done) => {});
    it('should throw an exception if the item exists but is deleted', (done) => {});
    it('should throw an exception if the database client fails', (done) => {});
  });

  describe('#update()', () => {
    it('should update only the fields that have changed if the item exists and is not deleted', (done) => {});
    it('should throw an exception if the item doesn\'t exist', (done) => {});
    it('should throw an exception if the item exists but is deleted', (done) => {});
    it('should throw an exception if the database client fails', (done) => {});
  });
});
