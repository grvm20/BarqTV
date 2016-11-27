'use strict';

const APP_PATH = '..';
const InvalidInputException = require(`${APP_PATH}/exceptions/invalid-input-exception`);
const Utils = require(`${APP_PATH}/utilities/utils`);

const VALID_COMMENT_REQUIRED_ATTRIBUTES = [
  "id",
  "customerRef",
  "contentRef",
  "text",
  "deleted"
];

module.exports = class Customer {
  constructor(attributes) {
    this.id = attributes.id || Utils.generateUuid();
    this.customerRef = attributes.customerRef;
    this.contentRef = attributes.contentRef;
    this.text = attributes.text;
    this.deleted = attributes.deleted || false;
  }

  set id(id) {
    if (id) {
      if (this.constructor.isValidId(id)) {
        this._id = id;
      } else {
        throw new InvalidInputException("id");
      }
    }
  }
  get id() {
    return this._id;
  }

  set customerRef(customerRef) {
    if (customerRef) {
      if (isValidCustomerRef(customerRef)) {
        this._customerRef = customerRef;
      } else {
        throw new InvalidInputException("customer reference")
      }
    }
  }
  get customerRef() {
    return this._customerRef;
  }

  set contentRef(contentRef) {
    if (contentRef) {
      if (isValidContentRef(contentRef)) {
        this._contentRef = contentRef;
      } else {
        throw new InvalidInputException("content reference")
      }
    }
  }
  get contentRef() {
    return this._contentRef;
  }

  set text(text) {
    if (text) {
      if (typeof text === 'string') {
        this._text = text;
      } else {
        throw new InvalidInputException("text")
      }
    }
  }
  get text() {
    return this._text;
  }

  set deleted(deleted) {
    if (typeof deleted === 'boolean') {
      this._deleted = deleted;
    }
  }
  get deleted() {
    return this._deleted;
  }

  // To be valid, it must contain all required attributes.
  validate() {
    for (var attribute of VALID_COMMENT_REQUIRED_ATTRIBUTES) {
      var hasAttribute = typeof this[attribute] !== 'undefined';
      var isValidAttribute = Utils.isValid(this[attribute]);
      if (!hasAttribute || !isValidAttribute) {
        throw new InvalidInputException(attribute);
      }
    }
    return true;
  }

  static isValidId(id) {
    return Utils.isUuidString(id);
  }
};

const isValidCustomerRef = (customerRef) => {
  return Utils.isEmailString(customerRef);
};

const isValidContentRef = (contentRef) => {
  return Utils.isUuidString(contentRef);
};
