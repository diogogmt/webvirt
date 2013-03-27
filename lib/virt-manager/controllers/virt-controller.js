var logger
  , Step
  , _
  , helper;


var VirtManager = function (di) {
};

VirtManager.prototype.actions = function (req, res) {
  // originalUrl format is: /actionName/:ip/:name
  var route  = req.originalUrl.split("\/")[1]
    , name = req.params["name"]
    , ip = req.params["ip"]

  var options = {
    ip: ip,
    route: route + "/" + name
  };
  virt.actions(options, function (err, status) {
    var msg = {};
    if (err) {
      logger.error(err.toString(), {file: __filename, line: __line});
      resCode = 400;
      msg.err = err.toString();
    } else {
      resCode = 200;
      msg = status;
    }
    res.json(resCode, msg);
  });
};

VirtManager.prototype.dashboardView = function (req, res) {
  req.session = req.session || {};
  res.render("index", {user: req.session.username});
}

VirtManager.prototype.hostModels = function(req, res) {
  console.log("\n\n***VirtManager.hostModels");
  var host = hostFacory.createHost();
  host.findAll(function (err, models) {
    console.log("VirtManager - hostModels");
    console.log("err: ", err);
    console.log("models: ", models);
    console.log(typeof(models));
    res.json(err || models);
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