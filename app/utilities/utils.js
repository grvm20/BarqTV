'use strict';

/***
* Utility class for app
***/
module.exports = class Utils {

  static isEmpty(val) {
    var isEmpty = true;
    var value = val;
    if (value) {
      val = value.trim();
    }

    if (val) {
      isEmpty = false;
    }
    return isEmpty;
  }
}