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
  describe('#fetch()', () => {
    var unexistingCommentId;
    var invalidCommentId;
    var validComment;
    var mockDao;
    var commentService;

    before(() => {
      unexistingCommentId = "b21223f4-0444-417b-b81e-4ee398a2d1d0";
      invalidCommentId = "this is definitely not valid";

      validComment = {
        id: "db93b284-4ae7-47b2-9ded-0e447a401ab9",
        customerRef: "email@domain.com",
        contentRef: "49feafac-494b-4da3-8e23-09ebc6e069b1",
        text: "Another crappy comment that should be stored!",
        deleted: false
      }

      mockDao = {
        fetch: (key, callback) => {
          var commentDbInfo = {
            id: validComment.id,
            customer_ref: validComment.customerRef,
            content_ref: validComment.contentRef,
            text: validComment.text,
            deleted: validComment.deleted
          }
          if (key.id == validComment.id) {
            callback(null, commentDbInfo);
          } else {
            callback(new ObjectNotFoundException());
          }
        }
      };
      commentService = new CommentService(mockDao);
    });

    it('should return the Comment with given id if it exists', (done) => {
      commentService.fetch(validComment.id, null, (err, comment) => {
        expect(err).to.not.exist;
        expect(comment).to.be.an.instanceof(Comment);
        expect(comment.id).to.equal(validComment.id);
        expect(comment.customerRef).to.equal(validComment.customerRef);
        expect(comment.contentRef).to.equal(validComment.contentRef);
        expect(comment.text).to.equal(validComment.text);
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
    it.skip('should return a persisted Comment if the given one is valid', (done) => {
    });
    it.skip('should return an exception if the given Comment is invalid', (done) => {
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