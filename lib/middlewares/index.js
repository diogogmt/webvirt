var di = {};

// Load dependencies 
di.config = config = require('../../config/config.js');
di.logger = logger = require('../../utils/logger.js').inject(di);
di.helper = require('../../utils/helper.js').inject(di);


// Require middlewares and inject dependencies
exports.validateIp = require("./validate-ip")(di);