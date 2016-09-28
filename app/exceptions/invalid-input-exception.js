'use strict';

/***
* Exception class. To be used when validating input
***/
module.exports = class InvalidInputException{
	constructor(key){
		this.key = key
	}

	toString() {
		return "Invalid: " + this.key;
	}
}