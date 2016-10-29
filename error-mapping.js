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

/*------------------------------------------------------------------------------------------*/

module.exports = {
	sendHttpResponse: function (callback) {
	  return (err, body) => {
	  	console.error("Checking value of err: " + err)
	    var statusCode = '200';
	    var body = body;
	    if (err) {
	      switch (err.constructor) {
	          case InvalidInputException:
	              statusCode = '400';
	              break;
	          case ObjectNotFoundException:
	              statusCode = '404';
	              break;
	          case MethodNotAllowedException:
	              statusCode = '405';
	              break;
	          case DataObjectErrorException:
	              statusCode = '500';
	              break;
	          default: statusCode ='500';
	      	}

	      body = err.message;
	      console.error(err);
	    }

	    callback(null, {
	      statusCode: statusCode,
	      body: body,
	      headers: {
	        'Content-Type': 'application/json',
	      }
	    });
	  };
	}	
};
