console.log('Loading function');

var AWS = require('aws-sdk');  
AWS.config.region = 'us-west-2';

exports.handler = function(event, context) {  
  console.log("\n\nLoading handler\n\n");
  var sns = new AWS.SNS();

  sns.publish({
    Message: JSON.stringify({
      default: JSON.stringify({
        operation: 'create',
        customer: {
          "email": "josruice@gmail.com",
          "first_name": "Jose",
          "last_name": "Ruiz",
          "phone_number": "9299295454",
          "address": {
            "street": "Tiemann Place",
            "number": "55",
            "apt": "29",
            "zip_code": "10027",
            "city": "New York",
            "state": "NY"
          }
        }
      })
    }),
    TopicArn: 'arn:aws:sns:us-west-2:837747084991:customer-resource-test',
    MessageStructure: 'json'
  }, function(err, data) {
    if (err) {
      console.log(err.stack);
      return;
    }
    console.log('push sent');
    console.log(data);
    context.done(null, 'Function Finished!');  
  });
};