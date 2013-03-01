var di = {};
var routes = {};

// Require middlewares
var validateIp = require("./../middlewares").validateIp;

// Load dependencies
var _ = di._ = require("underscore");
di.config = config = require('../../config/config.js');
di.logger = logger = require('../../utils/logger.js').inject(di);
di.helper = require('../../utils/helper.js').inject(di);
di.Step = require("step");

di.config.type = process.env["NODE_SERVER_TYPE"];
console.log("di.config.type: ", di.config.type);
di.virtManager = require("./controllers/virt-manager").inject(di);

if (di.config.type === "server") {
  routes.virtManager = [
    {
      type: "get",
      middleware: [],
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
} else if (di.config.type === "client") {
  routes.virtManager = [
    {
      type: "get",
      middleware: [],
      route: "/list/vms",
      callback: di.virtManager["listSingle"]
    },

    {
      type: "get",
      middleware: [],
      route: "/stats/version",
      callback: di.virtManager["stats"]
    },

    {
      type: "get",
      middleware: [],
      route: "/stats/cpu",
      callback: di.virtManager["stats"]
    },

    {
      type: "get",
      middleware: [],
      route: "/stats/mem",
      callback: di.virtManager["stats"]
    },

    {
      type: "get",
      middleware: [],
      route: "/status/:name",
      callback: di.virtManager["actions"]
    },

    {
      type: "get",
      middleware: [],
      route: "/start/:name",
      callback: di.virtManager["actions"]
    },

    {
      type: "get",
      middleware: [],
      route: "/resume/:name",
      callback: di.virtManager["actions"]
    },

    {
      type: "get",
      middleware: [],
      route: "/suspend/:name",
      callback: di.virtManager["actions"]
    },

    {
      type: "get",
      middleware: [],
      route: "/shutdown/:name",
      callback: di.virtManager["actions"]
    },

    {
      type: "get",
      middleware: [],
      route: "/destroy/:name",
      callback: di.virtManager["actions"]
    }
  ];
}

module.exports = _.union(routes.virtManager);