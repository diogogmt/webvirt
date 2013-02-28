
var _ = require("underscore");

var di = {};

// Load dependencies
di.config = config = require('../../config.js');
di.logger = logger = require('../../logger.js').inject(di);
// di.config.type = process.env["NODE_SERVER_TYPE"];
di.config.type = "server";
di.helper = require('../../helper.js').inject(di);

di.virtManager = require("./controllers/virt-manager").inject(di);

// console.log("di: ", di);

var routes = {};

routes.virtManager = [
  {
    type: "get",
    middleware: [],
    route: "/index",
    callback: di.virtManager["memStats"]
  },

  {
    type: "get",
    middleware: [],
    route: "/list/vms",
    callback: di.virtManager["listGroup"]
  },

  {
    type: "get",
    middleware: [],
    route: "/list/vms/:ip",
    callback: di.virtManager["listSingle"]
  },

  {
    type: "get",
    middleware: [],
    route: "/stats/version/:ip",
    callback: di.virtManager["version"]
  },

  {
    type: "get",
    middleware: [],
    route: "/stats/cpu/:ip",
    callback: di.virtManager["cpuStats"]
  },

  {
    type: "get",
    middleware: [],
    route: "/stats/mem",
    callback: di.virtManager["memStats"]
  },

  {
    type: "get",
    middleware: [],
    route: "/status/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/start/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/resume/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/suspend/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/shutdown/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/destroy/:ip/:name",
    callback: di.virtManager["actions"]
  }
];


module.exports = _.union(routes.virtManager);