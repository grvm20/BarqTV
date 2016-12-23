'use strict';

const APP_PATH = '../';
const Logger = require(`${APP_PATH}/utilities/logger`);

const AWS = require("aws-sdk");
const SNS = new AWS.SNS();

class SnsNotifier {
  static sendCustomerCreated() {
    sendEvent({code: 1}, "SNS from Customer Lambda function");
  }

  static sendError() {
    sendEvent({code: 2}, "SNS due to error");
  }

  static sendCommentCreated() {
    sendEvent({code: 3}, "SNS from Comment Lambda function");
  }

  static sendCustomerDeleted() {
    sendEvent({code: 5}, "SNS from Customer Lambda function");
  }
}

module.exports = SnsNotifier;

function sendEvent(content, subject) {
  var params = {
    Message: JSON.stringify(content),
    Subject: subject ? subject : "",
    TopicArn: "arn:aws:sns:us-west-2:837747084991:notify-composite"
  };

  SNS.publish(params, function(err, data){
    if (err){
      Logger.error(`Error sending message: ${err}`);
    } else {
      Logger.log(`Sent message: ${data.MessageId}`);
    }
  });
}
