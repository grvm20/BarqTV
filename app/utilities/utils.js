'use strict';

const _ = require('underscore');

/***
* Utility class for app
***/
module.exports = class Utils {

  static isEmpty (val) {
    return _.isEmpty( (val && val.trim)? val.trim() : val );
  }
}