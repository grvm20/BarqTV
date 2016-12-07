'use strict';

const APP_PATH = '..';
const Utils = require(`${APP_PATH}/utilities/utils`);
const Logger = require(`${APP_PATH}/utilities/logger`);
const Comment = require(`${APP_PATH}/models/comment`);

module.exports = class CommentsController {
  constructor(commentService, commentSerializer) {
    this.commentService = commentService;
    this.commentSerializer = commentSerializer;
  }

  show(params, callback) {
    Logger.log(`Params received in CommentsController#show(): `+
      `${JSON.stringify(params)}`);
    var id = params.id;
    var queryParams = Utils.omit(params, id);
    this.commentService.fetch(id, queryParams, (err, comment) => {
      if (err) return callback(err);
      this.commentSerializer.render(comment, callback);
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
