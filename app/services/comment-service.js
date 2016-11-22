'use strict';

const Comment = require('../models/comment');

module.exports = class CommentService {
  constructor(dao) {
    this._dao = dao;
  }

  create(input) {}

  fetch(id, queryParams, callback) {}

  save(comment, callback) {}

  delete(id, callback) {}

  update(id, comment, callback) {} 
}
