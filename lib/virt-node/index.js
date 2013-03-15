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

// Load dependencies
var _ = di._ = require("underscore");
di.Step = require('../../external/step/lib/step.js');
di.exec = require('child_process').exec;
di.config = config = require('../../config/config.js');

exports.virtModel = di.virtModel = require("./models/virt-model.js").inject(di);

exports.virtController = virtController = require("./controllers/virt-controller").inject(di);

routes.virtController = [
  {
    type: "get",
    middleware: [],
    route: "/list/vms",
    callback: virtController["list"]
  },

  {
    type: "get",
    middleware: [],
    route: "/hostStats",
    callback: virtController["hostStats"]
  },

  {
    type: "get",
    middleware: [],
    route: "/status/:name",
    callback: virtController["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/start/:name",
    callback: virtController["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/resume/:name",
    callback: virtController["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/suspend/:name",
    callback: virtController["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/shutdown/:name",
    callback: virtController["actions"]
  },

  {
    type: "get",
    middleware: [],
    route: "/destroy/:name",
    callback: virtController["actions"]
  }
];

var routesCallback = _.union(routes.virtController);

for (i = 0; i < routesCallback.length ; i++) {
  r = routesCallback[i];
  // console.log("r: ", r);
  console.log("creating route: ", r.route);
 
  app[r.type](r.route, r.middleware, r.callback);
}
