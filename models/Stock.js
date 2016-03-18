var mongoose = require('mongoose');
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
    date: Date,
    data: [{
      time: Number,
      value: Number
    }]
  }]
});
var Stock = mongoose.model('Stock', stockSchema);

var populateDb = function(json, callback){
  for (var i = 0; i < json.rows.length; i++) {
    var row = json.rows[i];
    var foundStock = false;
    console.log('Stock created: ' + stock);
    var stock = Stock.find({
      key: row.values.ITEM_SECTOR
    }, function(err, stock) {
      if (err) throw err;

      if(!stock){
        Stock.create({
          name: row.values.LONG_NAME,
          label: row.values.ITEM,
          key: row.values.ITEM_SECTOR
        }, function(err, stock) {
          if (err) {
            console.log(err);
            strOutput = 'Oh dear, we\'ve got an error';
          } else {
            console.log('Stock created: ' + stock);
          }
        });
      }

    });

  }
  callback();
};
// the schema is useless so far
// we need to create a model using it


// make this available to our users in our Node applications
module.exports.Stock = Stock;
module.exports.populateDb = populateDb;
