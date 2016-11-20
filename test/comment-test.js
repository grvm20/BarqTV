const expect = require('chai').expect;
const InvalidInputException = require("../app/exceptions/invalid-input-exception");
const Comment = require('../app/models/comment');

describe('Comment', () => {
  describe('#constructor', () => {
    it('should create a Comment object when input is valid', () => {
      var comment = new Comment({
        id: "4e6f9a3a-cb8b-4a95-913c-98b5964abe10",
        customerRef: "test@mocha.com",
        contentRef: "75656200-d8fe-4c04-9a2f-559ba1156e00",
        text: "This is an awesome comment for testing purposes :D",
        deleted: false
      });
      expect(comment).to.be.an.instanceof(Comment);
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
  });
});