var path = require("path");
var winston = require('winston');


Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error;
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function(){
    return __stack[1].getLineNumber();
  }
});

var Logger = function (data) {
  winston.add(winston.transports.File, {
    filename: data.path,
    handleExceptions: false
  });
}

Logger.prototype.info = function (msg, metadata) {
  winston.info(msg, metadata);
};

Logger.prototype.warn = function (msg, metadata) {
  winston.warn(msg, metadata);
};

Logger.prototype.error = function (msg, metadata) {
  winston.error(msg, metadata);
};

module.exports.inject = function (di) {
  return new Logger({path: di.config.logger.serverLog});
}

