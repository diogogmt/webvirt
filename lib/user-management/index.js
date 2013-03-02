var di = {};
var routes = {};

// Require middlewares

// Load dependencies
var _ = require("underscore");
di.config = config = require('../../config/config.js');
di.logger = logger = require('../../utils/logger.js').inject(di);
di.helper = require('../../utils/helper.js').inject(di);
di.Step = require('step');
di.client = require('../../utils/db-conn');
di.bcrypt = require('bcrypt');
di.scrypt = require('scrypt');
di.userFactory = require('./models/user-model.js').inject(di);
di.userController = require("./controllers/user-controller").inject(di);

routes.virtManager = [
  {
    type: "get",
    middleware: [],
    route: "/list/vms",
    callback: di.virtManager["listGroup"]
  },
];

module.exports = _.union(routes.virtManager);