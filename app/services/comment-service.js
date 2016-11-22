'use strict';

const APP_PATH = '..';
const Comment = require(`${APP_PATH}/models/comment`);
const Utils = require(`${APP_PATH}/utilities/utils`);
const Logger = require(`${APP_PATH}/utilities/logger`);
const InvalidInputException = require(`${APP_PATH}/exceptions/invalid-input-exception`);

module.exports = class CommentService {
  constructor(dao) {
    this._dao = dao;
  }

  fetch(id, queryParams, callback) {
    if (id) {
      var invalidId = !Comment.isValidId(id);
      if (invalidId) {
        return callback(new InvalidInputException("id"));
      }

      var commentKey = createCommentKey(id);
      this._dao.fetch(commentKey, (err, commentDbObject) => {
        if (err) return callback(err);
        var attributes = mapDbObjectToCommentAttributes(commentDbObject);
        createComment(attributes, (err, comment) => {
          if (err) return callback(err);
          Logger.log("Successfully fetched Comment with id: %s", comment.id);
          return callback(null, comment);
        });
      });
    } else {
      return callback(new InvalidInputException("id"));
    }
  }

  save(comment, callback) {}

  delete(id, callback) {}

  update(id, comment, callback) {} 
}

function createComment(attributes, callback) {
  try {
    var comment = new Comment(attributes);
    return callback(null, comment);
  } catch (err) {
    return callback(err);
  }
}

function createCommentKey(id) {
  return {
    id: id
  };
}

function mapDbObjectToCommentAttributes(dbObject) {
  return {
    id: dbObject.id,
    customerRef: dbObject.customer_ref,
    contentRef: dbObject.content_ref,
    text: dbObject.text,
    deleted: dbObject.deleted
  };
}
