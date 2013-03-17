var logger
  , Step
  , _
  , helper;


var VirtManager = function (di) {
};

VirtManager.prototype.actions = function (req, res) {
  var route  = req.originalUrl.split("\/")[1]
    , name = req.params["name"]
    , ip = req.params["ip"]

  var options = {
    ip: ip,
    route: route + "/" + name
  };
  console.log("\n\n^^^^VirtManager.actions");
  console.log("options: ", options);
  virt.actions(options, function (err, status) {
    console.log("\n\nvirt.actions - callback");
    console.log("err: ", err);
    console.log("status: ", status);
    var msg = {};
    if (err) {
      logger.error(err.toString(), {file: __filename, line: __line});
      resCode = 400;
      msg.err = err.toString();
    } else {
      resCode = 200;
      msg = status; // "this" references express
    }
    res.json(resCode, msg);
  });
};

VirtManager.prototype.allStats = function (req, res) {
  console.log("\n\n***VirtManager.allStats");
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

VirtManager.prototype.dashboardView = function (req, res) {
  req.session = req.session || {};
  res.render("virt-manager/dashboard.jade", {user: req.session.username});
}

VirtManager.prototype.hostModels = function(req, res) {
  console.log("\n\n***VirtManager.hostModels");
  var host = hostFacory.createHost();
  host.findAll(function (models) {
    res.json(models);
  })
};

VirtManager.prototype.listSingle = function (req, res) {
  console.log("\n\n***VirtManager.listSingle");
  var ip = req.params["ip"];
  
  var vmInfo = {
    ip: ip,
    route: "list/vms"
  };

  virt.listSingle(vmInfo, function (err, list) {
    console.log("\n\n*** virt.listSingle - callback");
    var msg = {};
    if (err) {
      logger.error(err.toString(), {file: __filename, line: __line});
      resCode = 400;
      msg.err = err.toString();
    } else {
      resCode = 200;
      msg = list;
    }
    res.json(resCode, msg);
  });
};

VirtManager.prototype.listGroup = function (req, res) {
  // err is aggregated in the list on a per host basis
  virt.listGroup(function (list) {
    res.json(200, list);
  });
};



module.exports.inject = function(di) {
  // Init dependencies

  virt = di.virtModel;
  helper = di.helper;
  Step = di.Step;
  _ = di._;
  logger = di.logger;

  di.virt = virt;
  hostFacory = require('../models/host-model.js').inject(di);
  
  return new VirtManager(di);
}