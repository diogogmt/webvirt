
var di = {};

// Load dependencies
di.config = config = require('../../config.js');
di.logger = logger = require('../../logger.js').inject(di);
di.helper = require('../../helper.js').inject(di);

di.config.type = process.env["NODE_SERVER_TYPE"];
console.log("di.config.type: ", di.config.type);

di.Step = require("step");

var _ = di._ = require("underscore");
di.virtManager = require("./controllers/virt-manager").inject(di);


var routes = {};

// Require middlewares
var validateIp = require("./../middlewares").validateIp;

routes.virtManager = [
  {
    type: "get",
    middleware: [validateIp],
    route: "/list/vms",
    callback: di.virtManager["listGroup"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/list/vms/:ip",
    callback: di.virtManager["listSingle"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/stats/version/:ip",
    callback: di.virtManager["stats"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/stats/cpu/:ip",
    callback: di.virtManager["stats"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/stats/mem/:ip",
    callback: di.virtManager["stats"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/status/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/start/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/resume/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/suspend/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/shutdown/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [validateIp],
    route: "/destroy/:ip/:name",
    callback: di.virtManager["actions"]
  }
];


module.exports = _.union(routes.virtManager);