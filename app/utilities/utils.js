'use strict';

/***
* Utility class for app
***/
module.exports = class Utils {

  static isEmpty(val) {
    var isEmpty = true;
    var val = value;
    if (value) {
      val = value.trim();
    }

    if (val) {
      isEmpty = false;
    }
    return isEmpty;
  }
}