var mongoose = require('mongoose');
var logger = require('../logging/logger');
var options = require('../config/index');
var async = require('async')
var request = require('request');
var Schema = mongoose.Schema;

// create a schema
var stockSchema = new Schema({
  name: String,
  label: String,
  sector: String,
  key: String,
  dataSeries: [{
    size: Number,
    pruneBucketSeconds: Number,
    date: {type: Date, default: Date.now},
    data: []
  }]
});


stockSchema.statics.initDb = function(json, callback){
  var that = this;
  var count = 0;
  for (var i = 0; i < json.rows.length; i++) {
    var row = json.rows[i];
    var foundStock = false;
    console.log("checking if stock with key: "+row.values.ITEM_SECTOR+" exists...");

    this.update({
      key: row.values.ITEM_SECTOR
    }, {$set: {
      name: row.values.LONG_NAME,
      label: row.values.ITEM,
      key: row.values.ITEM_SECTOR
    }}, {upsert: true}, function(err) {
      if (err) throw err;

      console.log("hmm");
    });

  }

};


var afterAllTasks = function(err){
  console.log(err);
  process.exit(0);
}

stockSchema.statics.fetchNewData = function(callback){
  console.log("finding stocks");
  this.find({}, '_id key label sector').exec(function(err, stocks){
    if(stocks && stocks.length > 0){
      console.log("Found: " + stocks.length + " stocks");
      var count = 0;
      async.forEach(stocks.slice(0, 1), processTask, afterAllTasks);

    } else {
      console.log("found 0 stocks");

    }

  });



};



stockSchema.statics.fetchDataForStock = function(stock, callback){
  console.log("Started fetchDataForStock: " + stock);
  request(options.storageConfig.osloStockExchange.daily + stock.key + "?points=500", function(error, response, body){
    if (!error && response.statusCode == 200) {

      var json = JSON.parse(body);
      console.log("got stockData: " + json);
      var seriesJson = json.rows[0].values.series.s1;
      var dataSerie = {
        size: seriesJson.dataSize,
        pruneBucketSeconds: seriesJson.pruneBucketSeconds,
        data: seriesJson.data
      }
      stock.update({$push: {dataSeries: dataSerie}}, function(err, raw){
        if(err)
          console.log("Saved Stock");
          callback(error, raw);
      });

    } else {
      console.log("error occured stockData: " + error);
      callback(error, null);
    }

  });


};
// the schema is useless so far
// we need to create a model using it
var Stock = mongoose.model('Stock', stockSchema);
var processTask = function(stock, callback){
  Stock.fetchDataForStock(stock, function(error, raw){
    //var last = i >= stocks.length;
    console.log("Finished fetchDataForStock: ");
    callback(error);


  });
}

// make this available to our users in our Node applications
module.exports = Stock;
