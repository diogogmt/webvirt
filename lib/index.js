console.log("lib/index.js");

var express = require('express')
  , app = exports = module.exports = express();

var _ = require("underscore");




var virtCallbacks = require("./virt");
// var userManagementCallbacks = require("./user-management");
// console.log("virtCallbacks: ", virtCallbacks);
// console.log("userManagementCallbacks: ", userManagementCallbacks);

var routesCallback = _.union(virtCallbacks);
// console.log("routesCallback", routesCallback);


for (i = 0; i < routesCallback.length; i++) {
  r = routesCallback[i];
  // console.log("r: ", r);
  console.log("creating route: ", r.route);
 
  app[r.type](r.route, r.middleware, r.callback);
}


