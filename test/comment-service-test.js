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
  var unexistingContentRef;
  var invalidCommentId;
  var validCommentPartialData;
  var invalidPartialCommentData;
  var validCommentData;
  var validCommentsDataSameContent;
  var validCommentDataToUpdate;
  var validCommentDataUpdated;
  var validPartialComment;
  var invalidPartialComment;
  var validComment;
  var validCommentToUpdate;
  var mockDao;
  var commentService;

  before(() => {
    unexistingCommentId = "b21223f4-0444-417b-b81e-4ee398a2d1d0";
    unexistingContentRef = "4d551e55-7820-49e5-828b-8c8fc2b21531";
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

    validCommentsDataSameContent = [
      {
        id: "db93b284-4ae7-47b2-9ded-0e447a401ab9",
        customerRef: "email@domain.com",
        contentRef: "49feafac-494b-4da3-8e23-09ebc6e069b1",
        text: "Another crappy comment that should be stored!",
        deleted: false
      },
      {
        id: "bbaaf044-2c64-4ff7-aa12-ab816dba5137",
        customerRef: "new-email@domain.com",
        contentRef: "49feafac-494b-4da3-8e23-09ebc6e069b1",
        text: "I changed my mind, I love it! :D (L) :) <3",
        deleted: false
      }
    ];


    validCommentDataToUpdate = {
      id: "db93b284-4ae7-47b2-9ded-0e447a401ab9",
      text: "Changed my mind, I now want this to be this way"
    }

    validCommentDataUpdated = {
      id: "db93b284-4ae7-47b2-9ded-0e447a401ab9",
      customerRef: "email@domain.com",
      contentRef: "49feafac-494b-4da3-8e23-09ebc6e069b1",
      text: "Changed my mind, I now want this to be this way",
      deleted: false
    }

    invalidPartialCommentData = {
      contentRef: "e80c316f-5f1f-4d2f-879e-11f286a1901b",
      text: "Winter is com... wait...",
    }

    // This might fail if the definition of Comment changes.
    validPartialComment = new Comment(validCommentPartialData);
    validComment = new Comment(validCommentData);
    validCommentToUpdate = new Comment(validCommentDataToUpdate);
    invalidPartialComment = new Comment(invalidPartialCommentData);

    mockDao = {
      fetch: (key, callback) => {
        var commentDbInfo = {
          id: validCommentData.id,
          customer_ref: validCommentData.customerRef,
          content_ref: validCommentData.contentRef,
          text: validCommentData.text,
          deleted: validCommentData.deleted
        };

        var commentsSameContentInfo = [
          {
            id: validCommentsDataSameContent[0].id,
            customer_ref: validCommentsDataSameContent[0].customerRef,
            content_ref: validCommentsDataSameContent[0].contentRef,
            text: validCommentsDataSameContent[0].text,
            deleted: validCommentsDataSameContent[0].deleted
          },
          {
            id: validCommentsDataSameContent[1].id,
            customer_ref: validCommentsDataSameContent[1].customerRef,
            content_ref: validCommentsDataSameContent[1].contentRef,
            text: validCommentsDataSameContent[1].text,
            deleted: validCommentsDataSameContent[1].deleted
          }
        ];

        if (key.id == validCommentData.id) {
          callback(null, commentDbInfo);
        } else if (key.content_ref == validCommentsDataSameContent[0].contentRef) {
          callback(null, commentsSameContentInfo);
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
      },
      update: (key, newItem, callback) => {
        if (key.id == validCommentDataToUpdate.id) {
          expect(newItem.text).to.equal(validCommentDataUpdated.text);
          var updatedCommentDbInfo = {
            id: validCommentDataUpdated.id,
            customer_ref: validCommentDataUpdated.customerRef,
            content_ref: validCommentDataUpdated.contentRef,
            text: validCommentDataUpdated.text,
            deleted: validCommentDataUpdated.deleted
          }
          callback(null, updatedCommentDbInfo)
        } else {
          callback(new ObjectNotFoundException());
        }
      },
      delete: (key, callback) => {
        if (key.id == validCommentData.id) {
          var commentDbInfo = {
            id: validCommentData.id,
            customer_ref: validCommentData.customerRef,
            content_ref: validCommentData.contentRef,
            text: validCommentData.text,
            deleted: true
          }
          callback(null, commentDbInfo);
        } else {
          callback(new ObjectNotFoundException());
        }
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
    it('should return all Comments of a Content if its id is given as a query parameter', (done) => {
      var params = {content_ref: validCommentsDataSameContent[0].contentRef};
      commentService.fetch(null, params, (err, comments) => {
        expect(err).to.not.exist;
        for (let i = 0; i < comments.length; ++i) {
          let comment = comments[i];
          let validCommentData = validCommentsDataSameContent[i];
          expect(comment).to.be.an.instanceof(Comment);
          expect(comment.id).to.equal(validCommentData.id);
          expect(comment.customerRef).to.equal(validCommentData.customerRef);
          expect(comment.contentRef).to.equal(validCommentData.contentRef);
          expect(comment.text).to.equal(validCommentData.text);
        }
        done();
      });
    });
    it('should return an ObjectNotFoundException if the given Content id does not exist', (done) => {
      var params = {content_ref: unexistingContentRef};
      commentService.fetch(null, params, (err, comments) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(ObjectNotFoundException);
        done();
      });
    });
    it('should return an InvalidInputException if an invalid Comment id is given', (done) => {
      commentService.fetch('hola', null, (err, comment) => {
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
    it('should return an InvalidInputException if the given Comment is not complete', (done) => {
      commentService.save(invalidPartialComment, (err, comment) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(InvalidInputException);
        done();
      });
    });
  });

  describe('#delete()', () => {
    it('should return the deleted Comment with given id if it exists', (done) => {
      var id = validCommentData.id;
      commentService.delete(id, (err, comment) => {
        expect(err).to.not.exist;
        expect(comment).to.be.an.instanceof(Comment);
        expect(comment.id).to.equal(validCommentData.id);
        expect(comment.customerRef).to.equal(validCommentData.customerRef);
        expect(comment.contentRef).to.equal(validCommentData.contentRef);
        expect(comment.text).to.equal(validCommentData.text);
        done();
      });
    });
    it('should return an ObjectNotFoundException if no Comment exists with the given id', (done) => {
      var id = validPartialComment.id;
      commentService.delete(id, (err, comment) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(ObjectNotFoundException);
        done();
      });
    });
  });

  describe('#update()', () => {
    it('should return the updated Comment with given id if it exists and parameters are valid', (done) => {
      var id = validCommentToUpdate.id;
      commentService.update(id, validCommentToUpdate, (err, comment) => {
        expect(err).to.not.exist;
        expect(comment).to.be.an.instanceof(Comment);
        expect(comment.customerRef).to.equal(validComment.customerRef);
        expect(comment.contentRef).to.equal(validComment.contentRef);
        expect(comment.text).to.equal(validCommentToUpdate.text);
        done();
      });
    });
    it('should return an ObjectNotFoundException if no Comment exists with the given id', (done) => {
      var id = validPartialComment.id;
      commentService.update(id, validPartialComment, (err, comment) => {
        expect(err).to.exist;
        expect(err).to.be.an.instanceof(ObjectNotFoundException);
        done();
      });
    });
  });
});