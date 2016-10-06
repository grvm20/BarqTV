'use strict';

const _ = require('underscore');
const AWS = require('aws-sdk');
const sprintf = require('sprintf-js').sprintf;

const dynamoDocClient = new AWS.DynamoDB.DocumentClient();


/***
 * DAO class which handles all data access related operations.
 * Expects table name to be injected to each object of the class through constructor.
 *
 * To access database initialize an object with the table name and call the required operation 
 * passing the necessary parameters and callbacks
 ***/
module.exports = class Dao {

  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Persists object into DB
   * @item - Record to be persisted into DB
   * @callback - Callback function to which either error or data is passed back.
   * Argument to callback expected of the form(error, data)
   **/
  persist(key, item, callback) {

    var params = {
      TableName: this.tableName,
      Key: key
    };
    dynamoDocClient.get(params, function(err, data) {
      if (err) {
        console.error("Dynamo failed to persist data " + err);
        callback(err, null);
      } else {
        if (_.isEmpty(data)) {
          params = _.omit(params, 'Key');
          params.Item = item;
          dynamoDocClient.put(params, function(err, persistedData) {
            if (err) {
              console.error("Dynamo failed to persist data " + err);
              callback(err, null);
            } else {
              console.log("Successfully persited record into dynamo: " + JSON.stringify(item));
              callback(null, item);
            }
          });
        } else {
          throw "Item Already Exists";
        }
      }
    });
  }

  /**
   * Fetches object from DB
   * @key - Key on which record needs to be fetched from DB
   * @callback - Callback function to which either error or data is passed back.
   * Argument to callback expected of the form(error, data)
   **/
  fetch(key, callback) {

    var params = {
      TableName: this.tableName
    };
    if (key != null && key != "") {
      params.Key = key;

      dynamoDocClient.get(params, function(err, data) {
        if (err) {
          console.error("Dynamo failed to fetch data " + err);
          callback(err, null);
        } else {
          console.log("Successfully fetched record from dynamo: " + JSON.stringify(data));
          var item = data.Item;
          // This is necessary because we dont have a GSI on is_active field.
          // So we have to manually filter out the result
          if (!item || (item && item.deleted == true)) {
            item = {}
          }
          callback(null, item);
        }
      });

    } else {

      params.FilterExpression = "deleted = :value";
      params.ExpressionAttributeValues = { ":value": false };

      dynamoDocClient.scan(params, function(err, data) {
        if (err) {
          console.error("Dynamo failed to fetch data " + err);
          callback(err, null);
        } else {
          console.log("Successfully fetched record from dynamo: " + JSON.stringify(data));
          callback(null, data.Items);
        }
      });
    }
  }

  /**
   * Deletes object from DB
   * @key - Key on which record needs to be deleted from DB
   * @callback - Callback function to which either error or data is passed back.
   * Argument to callback expected of the form(error, data)
   **/
  delete(key, callback) {

    var params = {
      TableName: this.tableName,
      Key: key
    };

    dynamoDocClient.get(params, function(err, data) {
      if (err) {
        console.error("Dynamo failed to fetch data " + err);
        callback(err, null);
      } else {
        console.log("Successfully fetched record from dynamo: " + JSON.stringify(data));

        var item = data.Item;
        item.deleted = true;
        params.Item = item;

        dynamoDocClient.put(params, function(err, data) {
          if (err) {
            console.error("Dynamo failed to persist data " + err);
            callback(err, null);
          } else {
            console.log("Successfully deleted record from dynamo: " + JSON.stringify(item));
            callback(null, item);
          }
        });
      }
    });
  }

  /**
   * Updates object from DB
   * @key - Key on which record needs to be updated in DB
   * @newItem - Information to be updated in DB - contains list of key-value pairs that need to be updated - has to include PrimaryID
   * @callback - Callback function to which either error or data is passed back.
   * Argument to callback expected of the form(error, data)
   **/
  update(key, newItem, callback) {
    // Get object from Dynamo to compare first.
    this.fetch(key, (err, currentItem) => {
      if (err) {
        console.error(err);
        callback(err);
      } else {
        if (currentItem && _.isEmpty(currentItem)) {
          var errorMessage = "Unable to update a non-existing item.";
          console.error(errorMessage);
          callback(errorMessage);
        } else {
          var i = 0;
          var updateRequired = false;
          var expressionAttributeValues = {};
          var updateAssignments = [];

          _.each(_.keys(newItem), (key) => {
            if (currentItem[key] !== newItem[key]) {
              var attributeId = ":val" + i;
              updateAssignments.push(sprintf("%s = %s", key, attributeId));
              expressionAttributeValues[attributeId] = newItem[key];
              updateRequired = true;
              i++;
            }
          });

          var updateExpression = sprintf("SET %s", updateAssignments.join(', '));

          if (!updateRequired) {
            console.log("No new value given to any field. Nothing to update.");
            callback(null, currentItem);
            return;
          }

          console.log(sprintf("Using update expression: %s.", updateExpression));
          var params = {
            TableName: this.tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
          };

          dynamoDocClient.update(params, function(err, data) {
            if (err) {
              console.error("Dynamo failed to Update data " + err);
              callback(err, null);
            } else {
              console.log("Successfully updated record from dynamo: " + JSON.stringify(data));
              callback(null, data.Attributes);
            }
          });
        }
      }
    });
  }
};
