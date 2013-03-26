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

var di = {};
di.config = require('../config/config.js');
di.client = require('./db-conn.js');
di.winston = require('winston');
di.events = require('events');
console.log("requiring logger");
var logger = require('./logger.js').inject(di);

var User = require('../lib/user-management').userModel;

console.log("Removing all users...");
User.removeAll(function (err) {
  if (err) {
    logger.error("Error removing all users - " + err.toString(), {file: __filename, line: __line})
    process.exit(1);
    return;
  }
  console.log("All users removed.");
  process.exit(0);
});