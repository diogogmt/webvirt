var path = require("path");
var winston = require('winston');

var _logger;

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
  winston.info(msg + "\n", metadata);
};

Logger.prototype.warn = function (msg, metadata) {
  winston.warn(msg + "\n", metadata);
};

Logger.prototype.error = function (msg, metadata) {
  winston.error(msg + "\n", metadata);
};

module.exports.inject = function (di) {
  if (!_logger) {
    _logger = new Logger({path: di.config.logger.serverLog});
  }
  return _logger;
}

