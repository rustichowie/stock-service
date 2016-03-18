var mongoose = require('mongoose');
var request = require('request');
var options = require('./config/index');
var Stock = require('./models/Stock');
var async = require('async');
mongoose.connect('mongodb://localhost/stocks');
request(options.storageConfig.osloStockExchange.stockList, function(error, response, body){
  if (!error && response.statusCode == 200) {
    var json = JSON.parse(body);
    Stock.populateDb(json, function(){
      process.exit(0);
    });

  }
});

//console.log(Request);
  /*.end(function(data, response) {
    // parsed response body as js object
    var temp = data;
    var done = false;
    for (var i = 0; i < temp.rows.length; i++) {
      var foundStock = false;

      var stock = Stock.find({
        key: temp.rows[i].values.ITEM_SECTOR
      }, function(err, stock) {
        if (err) throw err;

        if(stock)
          foundStock = true;
      });
      if (!foundStock) {
        Stock.create({
          name: temp.rows[i].values.LONG_NAME,
          label: temp.rows[i].values.ITEM,
          key: temp.rows[i].values.ITEM_SECTOR
        }, function(err, stock) {
          if (err) {
            console.log(err);
            strOutput = 'Oh dear, we\'ve got an error';
          } else {
            console.log('Stock created: ' + stock);
          }
        });
      }
      if(i+1 === temp.rows.length-1){
        //callback();
      }
    }

  });*/


process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
/*MongoClient.connect('mongodb://localhost/stocks', function (err, db) {
    if (err) {
        throw err;
    } else {
        console.log("successfully connected to the database");
    }
    db.close();
});*/
