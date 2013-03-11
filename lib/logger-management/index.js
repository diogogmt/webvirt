console.log("lib/logger-management/index.js");


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
di.client = require('../../utils/db-conn').client;
di.Step = require('step');

di.config = config = require('../../config/config.js');
di.logger = logger = require('../../utils/logger.js').inject(di);
di.helper = require('../../utils/helper.js').inject(di);

exports.loggerModel = di.loggerModel = require('./models/logger-model').inject(di);

exports.loggerController = di.loggerController = require("./controllers/logger-controller").inject(di);
console.log("exports.loggerController: ", di.loggerController);

routes.loggerController = [
  {
    type: "get",
    middleware: [],
    route: "/logs",
    callback: di.loggerController["allLogs"]
  },
];

var routesCallback = _.union(routes.loggerController);
console.log("routesCallback: ", routesCallback);
for (i = 0; i < routesCallback.length; i++) {
  r = routesCallback[i];
  // console.log("r: ", r);
  console.log("creating route: ", r.route);
 
  app[r.type](r.route, r.middleware, r.callback);
}