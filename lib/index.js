console.log("lib/index.js");

var express = require('express')
  , app = exports = module.exports = express();

if (process.env["NODE_TYPE"] === "server") {
  console.log("Loading webvirt-manager routes");
  app.use(require("./virt"));
  app.use(require("./user-management"));
  app.use(require("./logger-management"));
} else {
  console.log("loading webvirt-node routes");
  app.use(require("./virt-node"));
}
