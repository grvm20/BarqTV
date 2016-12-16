'use strict';

const APP_PATH = '..';
const Utils = require(`${APP_PATH}/utilities/utils`);
const Logger = require(`${APP_PATH}/utilities/logger`);
const Comment = require(`${APP_PATH}/models/comment`);

const ALLOWED_QUERY_PARAMS = ['content_ref'];

module.exports = class CommentsController {
  constructor(commentService, commentSerializer) {
    this.commentService = commentService;
    this.commentSerializer = commentSerializer;
  }

  show(params, callback) {
    Logger.log(`Params received in CommentsController#show(): `+
      `${JSON.stringify(params)}`);
    var id = params.id;
    var queryParams = extractQueryParams(params);
    this.commentService.fetch(id, queryParams, (err, comments) => {
      if (err) return callback(err);
      this.commentSerializer.render(comments, callback);
    });
  }

  create(params, callback) {
    Logger.log(`Params received in CommentsController#create(): `+
      `${JSON.stringify(params)}`);
    this.buildCommentFromParams(params, (err, comment) => {
      if (err) return callback(err);
      this.commentService.save(comment, (err, savedComment) => {
        if (err) return callback(err);
        this.commentSerializer.render(savedComment, callback);
      });
    });
  }

  update(params, callback) {
    Logger.log(`Params received in CommentsController#update(): `+
      `${JSON.stringify(params)}`);
    this.buildCommentFromParams(params, (err, comment) => {
      if (err) return callback(err);
      var id = comment.id;
      this.commentService.update(id, comment, (err, updatedComment) => {
        if (err) return callback(err);
        this.commentSerializer.render(updatedComment, callback);
      });
    });
  }

  delete(params, callback) {
    Logger.log(`Params received in CommentsController#delete(): `+
      `${JSON.stringify(params)}`);
    var id = params.id;
    this.commentService.delete(id, (err, deletedComment) => {
      if (err) return callback(err);
      this.commentSerializer.render(deletedComment, callback);
    });
  }

  buildCommentFromParams(params, callback) {
    if (params.comment) params = params.comment;
    var attributes = this.commentSerializer.deserialize(params);
    Logger.log(`Comment attributes received: ${JSON.stringify(attributes)}`);

    try {
      var comment = new Comment(attributes);
      return callback(null, comment);
    } catch (err) {
      return callback(err);
    }
  }
}

function extractQueryParams(params) {
  if (params.comment) params = params.comment;
  var queryParams = {}
  for (let paramKey of Object.keys(params)) {
    let allowedParam = ALLOWED_QUERY_PARAMS.indexOf(paramKey) !== -1;
    let nonEmptyParam = !Utils.isEmpty(params[paramKey]);
    if (allowedParam && nonEmptyParam) {
      queryParams[paramKey] = params[paramKey];
    }
  }
  return queryParams;
}
