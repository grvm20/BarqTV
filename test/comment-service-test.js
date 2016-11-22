const expect = require('chai').expect;
const CommentService = require('../app/services/comment-service');

describe('CommentService', () => {
  describe('#create()', () => {
    it.skip('should return a Comment if one is given', () => {
    });
    it.skip('should return a Comment if valid comment parameters are given', () => {
    });
    it.skip('should throw an exception if invalid comment parameters are given', () => {
    });
  });

  describe('#fetch()', () => {
    it.skip('should return the Comment with given id if it exists', (done) => {
    });
    it.skip('should return all Comments of a Content if its id is given as a query parameter', (done) => {
    });
    it.skip('should return an exception if the given Content id does not exist', (done) => {
    });
    it.skip('should return an exception if no Comment object exists with the given id', (done) => {
    });
  });

  describe('#save()', () => {
    it.skip('should return a persisted Comment if the given one is valid', (done) => {
    });
    it.skip('should return an exception if the given Comment is invalid', (done) => {
    });
  });

  describe('#delete()', () => {
    it.skip('should return the deleted Comment with given id if it exists', (done) => {
    });
    it.skip('should return an exception if no Comment object exists with the given id', (done) => {
    });
  });

  describe('#update()', () => {
    it.skip('should return the updated Comment with given id if it exists and parameters are valid', (done) => {
    });
    it.skip('should return an exception if invalid comment parameters are given', (done) => {
    });
    it.skip('should return an exception if no Comment object exists with the given id', (done) => {
    });
  });
});