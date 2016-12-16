const expect = require('chai').expect;
const InvalidInputException = require("../app/exceptions/invalid-input-exception");
const Comment = require('../app/models/comment');

describe('Comment', () => {
  describe('#constructor', () => {
    it('should create a Comment when input is complete and valid', () => {
      var comment = new Comment({
        id: "4e6f9a3a-cb8b-4a95-913c-98b5964abe10",
        customerRef: "test@mocha.com",
        contentRef: "75656200-d8fe-4c04-9a2f-559ba1156e00",
        text: "This is an awesome comment for testing purposes :D",
        deleted: false
      });
      expect(comment).to.be.an.instanceof(Comment);
    });

    it('should create a Comment with a valid id when id is not provided', () => {
      var comment = new Comment({
        customerRef: "super-customer@myapp.com",
        contentRef: "a7c6617d-3e69-43df-93ce-2cb656bf2aeb",
        text: "This is yet another awesome comment for testing purposes :D",
      });
      expect(comment.id).to.exist;
      expect(Comment.isValidId(comment.id)).to.be.true;
    });

    it('should fail when using an invalid Customer reference', () => {
      var commentData = {
        id: "4e6f9a3a-cb8b-4a95-913c-98b5964abe10",
        customerRef: "hey! this is not an email :(",
        contentRef: "75656200-d8fe-4c04-9a2f-559ba1156e00",
        text: "This is another awesome comment for testing purposes :D",
        deleted: false
      };
      expect(() => {new Comment(commentData)}).to.throw(InvalidInputException);
    });

    it('should fail when using an invalid Content reference', () => {
      var commentData = {
        id: "4e6f9a3a-cb8b-4a95-913c-98b5964abe10",
        customerRef: "test@mocha.com",
        contentRef: "yeah, my content is reference is here... somewhere...",
        text: "This is another awesome comment for testing purposes :D",
        deleted: false
      };
      expect(() => {new Comment(commentData)}).to.throw(InvalidInputException);
    });

    it('should fail when a non-string text is given', () => {
      var commentData = {
        id: "4e6f9a3a-cb8b-4a95-913c-98b5964abe10",
        customerRef: "test@mocha.com",
        contentRef: "25f92fd4-ea7c-4bba-9b1b-3f8f2b6ebe56",
        text: 42, // The answer to the universe? OMG!
        deleted: false
      };
      expect(() => {new Comment(commentData)}).to.throw(InvalidInputException);
    });
  });

  describe('#isValidId()', () => {
    it('should return true when the given id is an UUID', () => {
      expect(Comment.isValidId(
        '5c28dd5d-0dc3-477d-a0b2-0eb7815361d6')).to.be.true;
      expect(Comment.isValidId(
        '5f49e638-d528-4177-a8ef-9dac7bb8bf81')).to.be.true;
      expect(Comment.isValidId(
        '72350dbe-0cc0-4fee-8e83-5889cf6a379a')).to.be.true;
      expect(Comment.isValidId(
        '5C28DD5D-0DC3-477D-A0B2-0EB7815361D6')).to.be.true;
    });

    it('should return false otherwise', () => {
      expect(Comment.isValidId('5c28dd5d-0dc3-477d-a0b2-0eb7861d6')).to.be.false;
      expect(Comment.isValidId(
        '5f49e638-d528-4177-a8ef-9dag7bb8bf81')).to.be.false;
      expect(Comment.isValidId('')).to.be.false;
      expect(Comment.isValidId('just a string')).to.be.false;
      expect(Comment.isValidId({
        id: '500dd257-a523-4b27-843f-2af85997d08c'
      })).to.be.false;
      expect(Comment.isValidId({})).to.be.false;
    });
  });
});