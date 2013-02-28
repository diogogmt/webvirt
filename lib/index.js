
// var virtManagerRoutes = require("./virt");
// console.log("virtManagerRoutes: ", virtManagerRoutes);
// var routes = _.union(virtManagerRoutes);

var express = require('express')
  , app = exports = module.exports = express();

var _ = require("underscore");




var virtCallbacks = require("./virt");
// console.log("virtCallbacks: ", virtCallbacks);

var routesCallback = _.union(virtCallbacks);
// console.log("routesCallback", routesCallback);


for (i = 0; i < routesCallback.length; i++) {
  r = routesCallback[i];
  console.log("r: ", r);
  app[r.type](r.route, r.callback);
}


