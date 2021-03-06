'use strict';

const APP_PATH = '..';
const Comment = require(`${APP_PATH}/models/comment`);
const Utils = require(`${APP_PATH}/utilities/utils`);
const Logger = require(`${APP_PATH}/utilities/logger`);
const InvalidInputException = require(`${APP_PATH}/exceptions/invalid-input-exception`);

module.exports = class CommentService {
  constructor(dao) {
    this.dao = dao;
  }

  fetch(id, queryParams, callback) {
    var key = null;
    var singleResult = false;
    var hasQueryParams = !Utils.isEmpty(queryParams);
    if (id) {
      var invalidId = !Comment.isValidId(id);
      if (invalidId) {
        return callback(new InvalidInputException("id"));
      }
      key = createCommentKey(id);
      singleResult = true;
    } else if (hasQueryParams) {
      key = queryParams;
    }

    this.dao.fetch(key, (err, dbResult) => {
      if (err) return callback(err);
      Logger.log(`Successfully fetched Comments: ${JSON.stringify(dbResult)}`);

      if (singleResult) {
        return createCommentFromDbObject(dbResult, callback);
      } else {
        return createCommentsFromDbObject(dbResult, callback);
      }
    });
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

  delete(id, callback) {
    Logger.log(`Proceeding to delete Comment ${id}.`);
    var key = createCommentKey(id);
    this.dao.delete(key, (err, commentDbObject) => {
      if (err) return callback(err);
      createCommentFromDbObject(commentDbObject, (err, deletedComment) => {
        if (err) return callback(err);
        Logger.log(`Successfully deleted Comment with id: ${deletedComment.id}`);
        return callback(null, deletedComment);
      });
    });
  }

  update(id, comment, callback) {
    Logger.log(`Proceeding to update Comment ${id}.`);
    var commentDbObject = mapCommentToDbObject(comment);
    var key = createCommentKey(id);
    var attributesToUpdate = Utils.omit(commentDbObject, 'id');
    this.dao.update(key, attributesToUpdate, (err, commentDbObject) => {
      if (err) {
        Logger.log(`Error while trying to update: ${JSON.stringify(commentDbObject)}`);
        return callback(err);
      }
      createCommentFromDbObject(commentDbObject, (err, updatedComment) => {
        if (err) return callback(err);
        Logger.log(`Successfully updated Comment with id: ${updatedComment.id}`);
        return callback(null, updatedComment);
      });
    });
  }
}

function createCommentsFromDbObject(commentsDbObject, callback) {
  var comments = [];
  for (let commentDbObject of commentsDbObject) {
    try {
      var comment = createCommentFromDbObject(commentDbObject);
    } catch (err) {
      return callback(err);
    }
    comments.push(comment);
  }
  if (callback) return callback(null, comments);
  return comments;
}

function createCommentFromDbObject(commentDbObject, callback) {
  var attributes = mapDbObjectToCommentAttributes(commentDbObject);
  return createComment(attributes, callback);
}

function createComment(attributes, callback) {
  try {
    var comment = new Comment(attributes);
  } catch (err) {
    if (callback) return callback(err);
    throw err;
  }
  if (callback) return callback(null, comment);
  return comment;
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
