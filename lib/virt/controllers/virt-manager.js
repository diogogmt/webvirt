var logger
  , Step
  , _
  , helper;


var VirtManager = function (di) {

};

VirtManager.prototype.dashboardView = function (req, res) {
  console.log("dashboardView");
  
  if (typeof(req.session.username) === "undefined") {
    logger.error("Failed to find valid user is session file.", {file: __filename, line: __line});
  }
 
  res.render("virt-manager/dashboard.jade", {user: req.session.username});
}

VirtManager.prototype.listSingle = function (req, res) {
  var headers = req.headers
    , host = headers.host && headers.host.split(":")[0] 
    , ip = req.params["ip"] || host
  
  var vmInfo = {
    ips: [ip],
    route: "list/vms"
  };

  virt.listSingle(vmInfo, function (err, list) {
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = "Something went wrong while listing instances of a libvirt host.";
    } else {
      resCode = 200;
      msg = list; // this references express
    }
    res.json(resCode, msg);
  });
};

VirtManager.prototype.listGroup = function (req, res) {
  // err is aggregated in the list on a per host basis
  virt.listGroup(function (list) {
    console.log("virt.listGroup - callback");
    res.json(200, list);
  });
};

VirtManager.prototype.actions = function (req, res) {
  var route  = req.originalUrl.split("\/")[1]
    , name = req.params["name"]
    , ip = req.params["ip"] // For client calls, the [ip] is unnecessary and 
                            // this variable remains undefined

  var vmInfo = {
    name: name,
    ips: [ip],              // See above
    route: route + "/" + name
  };

  virt.actions(route, vmInfo, function (err, status) {
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = "Something went wrong while performing an action on a virtual machine instance.";
    } else {
      resCode = 200;
      msg = status; // "this" references express
    }
    res.json(resCode, msg);
  });
};

VirtManager.prototype.allStats = function (req, res) {
  var route  = req.originalUrl.split("\/")[1];

  virt.hostStats(function (err, status) {
    var data = {};
    if (err && err.length) {
      resCode = 400;
      data.err = "Something went wrong while retrievng daemon-host stats.";
    } else {
      resCode = 200;
      data = status; // "this" references express
    }
    res.json(resCode, data);
  });
}

VirtManager.prototype.stats = function (req, res) {
  console.log("VirtManager stats");
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
 

  virt[routeName](vmInfo, function (err, status) {
    console.log("VirtManager stats - callback");
    console.log("err: ", err);
    console.log("status: ", status);
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = "Something went wrong while getting host stats";
    } else {
      resCode = 200;
      msg = status; // this references express
    }
    res.json(resCode, msg);
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