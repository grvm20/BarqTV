/* This file is responsible for mapping an exception object to the correct HTTP Response

The HTTP Response mapping to individual Exception objects
400 - Invalid Input Exception
401 - authentication-exception
403 - authorization-exception
404 - object-not-found
405 - method-not-allowed
500 - data-object-error*/

/* Required Exception objects for mapping to correct HTTP Response */

const DaoException = require('./app/exceptions/dao-exception');
const DataObjectErrorException = require('./app/exceptions/data-object-error-exception');
const MethodNotAllowedException = require('./app/exceptions/method-not-allowed-exception');
const ObjectExistsException = require('./app/exceptions/object-exists-exception');
const ObjectNotFoundException = require('./app/exceptions/object-not-found-exception');
const InvalidInputException = require("./app/exceptions/invalid-input-exception");
const AddressInvalidException = require('./app/exceptions/address-invalid-exception');
const AddressNotSpecificException = require('./app/exceptions/address-not-specific-exception');

/*------------------------------------------------------------------------------------------*/

module.exports = {
  sendHttpResponse: function(callback) {
    return (err, body) => {
      console.error("Checking value of err: " + err)
      var body = body;
      var errorMessage = '';
      if (err) {
        switch (err.constructor) {
          case InvalidInputException:
            errorMessage = '[400] ' + err.message;
            break;
          case ObjectNotFoundException:
            errorMessage = '[404] Element for the provided id does not exist in the system';
            break;
          case MethodNotAllowedException:
            errorMessage = '[405] Method is not allowed';
            break;
          case DataObjectErrorException:
            errorMessage = '[500] Internal System Failure';
            break;
          case ObjectExistsException:
            errorMessage = '[409] This id already exists';
            break;
          case AddressInvalidException:
            errorMessage = '[400] No such address exist';
            break;
          case AddressNotSpecificException:
            errorMessage = '[400] Address is not specific enough';
            break;
          default:
            errorMessage = '[500] Internal Server Error';
        }

        callback(errorMessage);
      } else {
        callback(null, body);
      }
    };
  }
};
