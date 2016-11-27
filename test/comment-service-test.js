'use strict';

const expect = require('chai').expect;

const APP_PATH = '../app';
const Comment = require(`${APP_PATH}/models/comment`);
const CommentService = require(`${APP_PATH}/services/comment-service`);
const ObjectNotFoundException =
  require(`${APP_PATH}/exceptions/object-not-found-exception`);
const InvalidInputException =
  require(`${APP_PATH}/exceptions/invalid-input-exception`);

describe('CommentService', () => {
  var unexistingCommentId;
  var invalidCommentId;
  var validCommentPartialData;
  var invalidPartialCommentData;
  var validCommentData;
  var validPartialComment;
  var invalidPartialComment;
  var validComment;
  var mockDao;
  var commentService;

  before(() => {
    unexistingCommentId = "b21223f4-0444-417b-b81e-4ee398a2d1d0";
    invalidCommentId = "this is definitely not valid";

    validCommentPartialData = {
      customerRef: "another-email@domain.com",
      contentRef: "2a17bf42-0370-4a15-aa12-30b82d1ae6a7",
      text: "Yet another comment that I would send to hell!",
    }

    validCommentData = {
      id: "db93b284-4ae7-47b2-9ded-0e447a401ab9",
      customerRef: "email@domain.com",
      contentRef: "49feafac-494b-4da3-8e23-09ebc6e069b1",
      text: "Another crappy comment that should be stored!",
      deleted: false
    }

    invalidPartialCommentData = {
      contentRef: "e80c316f-5f1f-4d2f-879e-11f286a1901b",
      text: "Winter is com... wait...",
    }

    // This might fail if the definition of Comment changes.
    validPartialComment = new Comment(validCommentPartialData);
    validComment = new Comment(validCommentData);
    invalidPartialComment = new Comment(invalidPartialCommentData);

    mockDao = {
      fetch: (key, callback) => {
        var commentDbInfo = {
          id: validCommentData.id,
          customer_ref: validCommentData.customerRef,
          content_ref: validCommentData.contentRef,
          text: validCommentData.text,
          deleted: validCommentData.deleted
        }
        if (key.id == validCommentData.id) {
          callback(null, commentDbInfo);
        } else {
          callback(new ObjectNotFoundException());
        }
      },
      persist: (key, item, callback) => {
        expect(item.id).to.exist;
        expect(item.customer_ref).to.equal(validCommentPartialData.customerRef);
        expect(item.content_ref).to.equal(validCommentPartialData.contentRef);
        expect(item.text).to.equal(validCommentPartialData.text);
        expect(item.deleted).to.be.false;
        callback(null, item);
      }
    };
    commentService = new CommentService(mockDao);
  });

  describe('#fetch()', () => {
    it('should return the Comment with given id if it exists', (done) => {
      commentService.fetch(validCommentData.id, null, (err, comment) => {
        expect(err).to.not.exist;
        expect(comment).to.be.an.instanceof(Comment);
        expect(comment.id).to.equal(validCommentData.id);
        expect(comment.customerRef).to.equal(validCommentData.customerRef);
        expect(comment.contentRef).to.equal(validCommentData.contentRef);
        expect(comment.text).to.equal(validCommentData.text);
        done();
      });
    });
    it.skip('should return all Comments of a Content if its id is given as a query parameter', (done) => {
    });
    it.skip('should return an exception if the given Content id does not exist', (done) => {
    });
    it('should return an InvalidInputException if no Comment id is given', (done) => {
      commentService.fetch(null, null, (err, comment) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(InvalidInputException);
        done();
      });
    });
    it('should return an InvalidInputException if an invalid Comment id is given', (done) => {
      commentService.fetch(invalidCommentId, null, (err, comment) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(InvalidInputException);
        done();
      });
    });
    it('should return an ObjectNotFoundException if no Comment exists with the given id', (done) => {
      commentService.fetch(unexistingCommentId, null, (err, comment) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(ObjectNotFoundException);
        done();
      });
    });
  });

  describe('#save()', () => {
    it('should return a persisted Comment if the given one is valid', (done) => {
      commentService.save(validPartialComment, (err, comment) => {
        expect(err).to.not.exist;
        expect(comment).to.be.an.instanceof(Comment);
        expect(comment.customerRef).to.equal(validPartialComment.customerRef);
        expect(comment.contentRef).to.equal(validPartialComment.contentRef);
        expect(comment.text).to.equal(validPartialComment.text);
        done();
      });
    });
    it('should return an exception if the given Comment is not complete', (done) => {
      commentService.save(invalidPartialComment, (err, comment) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(InvalidInputException);
        done();
      });
    });
  });

  describe('#delete()', () => {
    it.skip('should return the deleted Comment with given id if it exists', (done) => {
    });
    it.skip('should return an exception if no Comment exists with the given id', (done) => {
    });
  });

  describe('#update()', () => {
    it.skip('should return the updated Comment with given id if it exists and parameters are valid', (done) => {
    });
    it.skip('should return an exception if invalid comment parameters are given', (done) => {
    });
    it.skip('should return an exception if no Comment exists with the given id', (done) => {
    });
  });
});