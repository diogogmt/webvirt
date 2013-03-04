
var logger
  , Step
  , _
  , helper;


var VirtManager = function (di) {

};

VirtManager.prototype.dashboardView = function (req, res) {
  console.log("dashboardView");
  res.render("virt-manager/dashboard.jade");
}

VirtManager.prototype.listSingle = function (req, res) {
  var headers = req.headers
    , host = headers.host && headers.host.split(":")[0] 
    , ip = req.params["ip"] || host
  
  var vmInfo = {
    ips: [ip],
    route: "list/vms"
  };

  virt.listSingle(vmInfo, function (list) {
    return res.json(list);
  });
};

VirtManager.prototype.listGroup = function (req, res) {
  virt.listGroup(function (list) {
    return res.json(list);
  });
};

VirtManager.prototype.actions = function (req, res) {
  var route  = req.originalUrl.split("\/")[1]
    , name = req.params["name"]
    , ip = req.params["ip"]

  var vmInfo = {
    name: name,
    ips: [ip],
    route: route + "/" + name
  };

  virt.actions(route, vmInfo, function (status) {
    res.json(status);
  });
};


VirtManager.prototype.stats = function (req, res) {
  var routePieces  = req.originalUrl.split("\/")
    , ip = req.params["ip"];


  if (!routePieces[1] || !routePieces[2]) {
    logger.error("Failed to parse url: " + req.originalUrl, {file: __filename, line: __line});
    res.send({error: 1});
    return; 
  }

  // Valid routes names are: version, memStats, cpuStats
  var routeName = routePieces[2];
  // originalUrl should be /stats/version/:ip
  // route is the result of appending version and :ip
  var vmInfo = {
    ips: [req.params["ip"]],
    route: routePieces[1] + "\/" + routePieces[2]
  };
 

  virt[routeName](vmInfo, function (status) {
    res.json(status);
  });
};

VirtManager.prototype.hostModels = function(req, res) {
  console.log("VirtManager hostToModel");

  var host = hostFacory.createHost();
  host.findAll(function (models) {
    console.log("host findAll callback");
    console.log("models: ", models);
    
    res.json(models);
  })
};

module.exports.inject = function(di) {
  // Init dependencies

  // Virt server/client dependencies
  di.exec = require('child_process').exec;
  di.client = require("../../../utils/db-conn").client;
  di.http = require('http');
  di.request = require('request');

  virt = di.config.type === "server"
    ? require("../models/virt-server.js").inject(di)
    : require("../models/virt-client.js").inject(di);
  helper = di.helper;
  Step = di.Step;
  _ = di._;
  logger = di.logger;

  di.virt = virt;
  hostFacory = require('../models/host-model.js').inject(di);
  
  return new VirtManager(di);
}

