console.log("utils/logger.js");
var path = require("path");
var winston = require('winston');
var events = require('events');

var _logger;

var CustomLogger = function (config) {
  console.log("CustomLogger constructor");

  this.socketIO;
  var self = this;

  var path = config.clientPath;
  if (process.env['NODE_TYPE'] === "server") {
    path = config.serverPath;
  }

  // Requiring `winston-redis` will expose 
  // `winston.transports.Redis`
  console.log("starting winstoms-redis");
  require('../external/winston-redis/lib/winston-redis.js').Redis

  console.log("winston.add...");
  winston.add(winston.transports.Redis, {
    container: function (level, msg, meta) {
      console.log("level: ", level);
      return "winston:" + level;
    },
    'channel': 'steamLogs'
  });

  winston.handleExceptions(winston.transports.Redis);
  winston.exitOnError = false;

  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
      handleExceptions: true,
      json: true
  });
  
  winston.stream({ start: -1 }).on('log', function(log) {
    console.log("\n***winston.stream");
    var type = log.transport[0]
    if (self.socketIO && type === "redis") {
      console.log("\n**emitting socket msg");
      self.socketIO.emit("newLog", log);
    } else {
      console.log("this.loggerSocket not init");
    }
  });

}

CustomLogger.prototype = new events.EventEmitter();

CustomLogger.prototype.info = function (msg, metadata) {
  // console.log("CustomLogger.info");
  winston.info(msg + "\n", metadata);
  
};

CustomLogger.prototype.warn = function (msg, metadata) {
  winston.warn(msg + "\n", metadata);
};

CustomLogger.prototype.error = function (msg, metadata) {
  winston.error(msg + "\n", metadata);
};

CustomLogger.prototype.query = function (options, cb) {
  console.log("CustomLogger.prototype.query");
  // console.log("options: ", options);
  var start = options.start || 1;
  var rows = options.rows || 50;
  var type = options.type || 'redis';
  var level = options.level || 'error';

  

  // console.log("start: ", start);
  // console.log("rows: ", rows);
  // console.log("type: ", type);
  // console.log("level: ", level);

  winston.query({
    'start': +start,
    'rows': +rows,
    'level': level
  }, function (err, data) {
    console.log("winston.query");
    // console.log("arguments: ", arguments);
    var logs = [];
    var redisLogs = data.redis;
    var redisLogsLen = redisLogs && redisLogs.length || 0;
    var i;
    console.log("data.redis.length: ", data.redis.length);
    for (i = 0; i < redisLogsLen; i++) {
      var log = redisLogs[i];
      // console.log("log.level: ", log.level);
      // if (log.level === level) {
        // log.id = +start + i;
        logs.push(redisLogs[i]);
      // }
    }

    cb(err, logs);
  })  
}

module.exports.inject = function (di) {
  console.log("CustomLogger inject");
  if (!_logger) {
    _logger = new CustomLogger(di.config.logger);
  }
  return _logger;
}

