console.log("lib/virt/index.js");


var di = {}
  , routes = {}
  , express = require('express')
  , app = exports = module.exports = express();

app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
});

app.locals.pretty = true;

// Require middlewares
var validateIp = require("./../middlewares").validateIp;
var authUser = require("./../middlewares").authUser;

// Load dependencies
var _ = di._ = require("underscore");
di.client = require('../../utils/db-conn').client;
di.Step = require('../../external/step/lib/step.js');
di.bcrypt = require('bcrypt');
// di.scrypt = require('scrypt');
di.fs = require('fs');

di.config = config = require('../../config/config.js');
di.logger = logger = require('../../utils/logger.js').inject(di);
di.helper = require('../../utils/helper.js').inject(di);


// Virt server dependencies
di.http = require('http');
di.request = require('request');

exports.virtModel = di.virtModel = require("./models/virt-model.js").inject(di)

exports.virtManager = di.virtManager = require("./controllers/virt-controller").inject(di);

exports.daemonFactory = di.daemonFactory = require("./models/daemon-model").inject(di);

exports.daemonManager = di.daemonManager = require("./controllers/daemon-manager").inject(di);


routes.virtManager = [
  {
    type: "get",
    middleware: [authUser],
    route: "/",
    callback: di.virtManager["dashboardView"]
  },

  {
    type: "get",
    middleware: [authUser],
    route: "/list/models/hosts",
    callback: di.virtManager["hostModels"]
  },

  {
    type: "get",
    middleware: [authUser,validateIp],
    route: "/list/vms/:ip",
    callback: di.virtManager["listSingle"]
  },

  {
    type: "put",
    middleware: [authUser,validateIp],
    route: "/status/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "put",
    middleware: [authUser,validateIp],
    route: "/start/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "put",
    middleware: [authUser,validateIp],
    route: "/resume/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "put",
    middleware: [authUser,validateIp],
    route: "/suspend/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "put",
    middleware: [authUser,validateIp],
    route: "/shutdown/:ip/:name",
    callback: di.virtManager["actions"]
  },

  {
    type: "put",
    middleware: [authUser,validateIp],
    route: "/destroy/:ip/:name",
    callback: di.virtManager["actions"]
  }
];


routes.daemonManager = [
  {
    type: "get",
    middleware: [authUser],
    route: "/daemons/management",
    callback: di.daemonManager["daemonsView"]
  },

  {
    type: "post",
    middleware: [authUser],
    route: "/daemons/upload",
    callback: di.daemonManager["upload"]
  },

  {
    type: "get",
    middleware: [authUser],
    route: "/daemons/list",
    callback: di.daemonManager["list"]
  },

  {
    type: "get",
    middleware: [authUser],
    route: "/daemons",
    callback: di.daemonManager["list"]
  },

  {
    type: "post",
    middleware: [authUser,validateIp],
    route: "/daemons",
    callback: di.daemonManager["add"]
  },

  {
    type: "put",
    middleware: [authUser,validateIp],
    route: "/daemons/:ip",
    callback: di.daemonManager["update"]
  },

  {
    type: "delete",
    middleware: [authUser,validateIp],
    route: "/daemons/:ip",
    callback: di.daemonManager["delete"]
  },
];

var routesCallback = _.union(routes.virtManager, routes.daemonManager);

for (i = 0; i < routesCallback.length ; i++) {
  r = routesCallback[i];
  // console.log("r: ", r);
  // console.log("creating route: ", r.route);
 
  app[r.type](r.route, r.middleware, r.callback);
}
