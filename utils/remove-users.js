var di = [];
di.config = config = require('../config/config.js');
di.logger = logger = require('./logger.js').inject(di);

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