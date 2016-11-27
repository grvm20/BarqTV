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

  set dao(dao) {
    if (dao) {
      this._dao = dao;
    }
  }
  get dao() {
    return this._dao;
  }

  fetch(id, queryParams, callback) {
    if (id) {
      var invalidId = !Comment.isValidId(id);
      if (invalidId) {
        return callback(new InvalidInputException("id"));
      }

      var commentKey = createCommentKey(id);
      this.dao.fetch(commentKey, (err, commentDbObject) => {
        if (err) return callback(err);
        var attributes = mapDbObjectToCommentAttributes(commentDbObject);
        createComment(attributes, (err, comment) => {
          if (err) return callback(err);
          Logger.log(`Successfully fetched Comment with id: ${comment.id}`);
          return callback(null, comment);
        });
      });
    } else {
      return callback(new InvalidInputException("id"));
    }
  }

  save(comment, callback) {
    try {
      comment.validate();
    } catch (err) {
      return callback(err);
    }

    var commentString = JSON.stringify(comment);
    Logger.log(`Proceeding to save Comment ${commentString}.`);
    var key = createCommentKey(comment.id);
    var commentDbObject = mapCommentToDbObject(comment);
    this.dao.persist(key, commentDbObject, (err, item) => {
      if (err) {
        var commentDbObjectString = JSON.stringify(commentDbObject)
        Logger.log(`Error while trying to persist: ${commentDbObjectString}.`);
        return callback(err);
      }
      callback(null, comment);
    });
  }

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

function mapCommentToDbObject(comment) {
  var result = {
    id: comment.id
  }

  // Using loose equality check (==) instead of strict (===) as explained in:
  // http://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript
  if (comment.customerRef != null) {
    result.customer_ref = comment.customerRef;
  }
  if (comment.contentRef != null) {
    result.content_ref = comment.contentRef;
  }
  if (comment.text != null) {
    result.text = comment.text;
  }
  if (comment.deleted != null) {
    result.deleted = comment.deleted;
  }

  return result;
}
