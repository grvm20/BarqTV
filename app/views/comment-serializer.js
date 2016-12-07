'use strict';

const APP_PATH = '..';
const Utils = require(`${APP_PATH}/utilities/utils`);

module.exports = class CommentSerializer {
  serialize(comment) {
    return {
      id: comment.id,
      customer_ref: comment.customerRef,
      content_ref: comment.contentRef,
      text: comment.text
    };
  }

  deserialize(object) {
    var result = {};

    if (object.id != null) {
      result.id = object.id;
    }
    if (object.customer_ref != null) {
      result.customerRef = object.customer_ref;
    }
    if (object.content_ref != null) {
      result.contentRef = object.content_ref;
    }
    if (object.text != null) {
      result.text = object.text;
    }

    return result;
  }

  render(comments, callback) {
    if (Utils.isArray(comments)) {
      var result = [];
      for (let comment of comments) {
        result.push(this.serialize(comment));
      }
    } else {
      var result = this.serialize(comments);
    }
    callback(null, result);
  }
}
