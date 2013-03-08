var path = require("path");
var winston = require('winston');

var _logger;

var CustomLogger = function (config) {
  
  var path = config.clientPath;
  if (process.env['NODE_TYPE'] === "server") {
    path = config.serverPath;
  }

  // Requiring `winston-redis` will expose 
  // `winston.transports.Redis`
  require('winston-redis').Redis;


  winston.add(winston.transports.File, { filename: path });
  winston.add(winston.transports.Redis, {});

  winston.handleExceptions(new winston.transports.File({ filename: config.exceptionsPath }));
  winston.handleExceptions(new winston.transports.Redis());
  winston.exitOnError = false;

  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
      handleExceptions: true,
      json: true
  });
  

}

CustomLogger.prototype.info = function (msg, metadata) {
  winston.info(msg + "\n", metadata);
};

CustomLogger.prototype.warn = function (msg, metadata) {
  winston.warn(msg + "\n", metadata);
};

CustomLogger.prototype.error = function (msg, metadata) {
  winston.error(msg + "\n", metadata);
};

module.exports.inject = function (di) {
  console.log("logger inject");
  if (!_logger) {
    console.log("creating new logger");
    _logger = new CustomLogger(di.config.logger);
  }
  console.log("returning old logger");
  return _logger;
}

