var di = {};

// Load dependencies
var _ = di._ = require("underscore");
di.client = require('../../utils/db-conn').client;
di.Step = require('../../external/step/lib/step.js');
di.bcrypt = require('bcrypt');
// di.scrypt = require('scrypt');

di.config = config = require('../../config/config.js');
di.logger = logger = require('../../utils/logger.js').inject(di);
di.helper = require('../../utils/helper.js').inject(di);


// Require middlewares and inject dependencies
exports.validateIp = require("./validate-ip")(di);
exports.authUser = require("./auth-user")(di);