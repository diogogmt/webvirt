var di = {};

// Load dependencies 
di.config = config = require('../../config.js');
di.logger = logger = require('../../logger.js').inject(di);
di.helper = require('../../helper.js').inject(di);


// Require middlewares and inject dependencies
exports.validateIp = require("./validate-ip")(di);