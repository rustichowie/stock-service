var options = require('../config/index').storageConfig;
var winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({ filename: options.logger.logFile, timestamp: true, json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: options.logger.logFile, json: false })
  ],
  exitOnError: false
});

module.exports = logger;
