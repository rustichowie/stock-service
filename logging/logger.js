var fs = require('fs');
var options = require('../config/index').storageConfig;


module.exports.log = function(level, msg){
  var string = "["+level.toUpperCase()+"] - "+ Date.now + ": " + msg;
  fs.writeFile(options.logger.fileName,string, function(error){
    if(error) {
      console.error(error.message);
    } else {
      console.log("successful log");
    }

  })
};
