var fs = require('fs'),
configPath = './config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
module.exports.storageConfig = parsed;
