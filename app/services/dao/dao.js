'use strict';

const AWS = require('aws-sdk');
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
  persist(item, callback) {

    // New customer is always non-deleted by default
    item.deleted = false;
    var params = {
      TableName: this.tableName,
      Item: item
    };

    dynamoDocClient.put(params, function(err, data) {
      if (err) {
        console.error("Dynamo failed to persist data " + err);
        callback(err, null);
      } else {
        console.log("Successfully persited record into dynamo: " + JSON.stringify(item));
        callback(null, JSON.stringify(item));
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
          // This is necessary because we dont have a GSI on deleted field.
          // So we have to manually filter out the result
          if (item && item.deleted == true) {
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
            callback(null, JSON.stringify(item));
          }
        });
      }
    });
  }
};
