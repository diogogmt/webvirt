console.log("lib/user-management/index.js");


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
di.bcrypt = require('bcrypt');
di.scrypt = require('scrypt');
di.sliced = require('sliced');

di.config = config = require('../../config/config.js');
di.logger = logger = require('../../utils/logger.js').inject(di);
di.helper = require('../../utils/helper.js').inject(di);

exports.userModel = di.userFactory = require('./models/user-model').inject(di);

exports.userController = di.userController = require("./controllers/user-controller").inject(di);

routes.userController = [
  {
    type: "get",
    middleware: [],
    route: "/user/create",
    callback: di.userController["createView"]
  },

  {
    type: "get",
    middleware: [],
    route: "/user/login",
    callback: di.userController["loginView"]
  },

  {
    type: "get",
    middleware: [],
    route: "/user/changePassword",
    callback: di.userController["changePasswordView"]
  },

  {
    type: "post",
    middleware: [],
    route: "/user/create",
    callback: di.userController["create"]
  },

  {
    type: "post",
    middleware: [],
    route: "/user/auth",
    callback: di.userController["auth"]
  },

  {
    type: "post",
    middleware: [],
    route: "/user/changePassword",
    callback: di.userController["changePassword"]
  },
];

var routesCallback = _.union(routes.userController);
// console.log("routesCallback", routesCallback);

for (i = 0; i < routesCallback.length; i++) {
  r = routesCallback[i];
  // console.log("r: ", r);
  // console.log("creating route: ", r.route);
 
  app[r.type](r.route, r.middleware, r.callback);
}
