var logger = {}
  , Step
  , _
  , virt
  , _virtController

logger.error = function (err, metadata) {
  console.log("logger.error");
  console.log("err: ", err);
  console.log("medatata: ", metadata);
}

var VirtController = function (di) {

};


VirtController.prototype.actions = function (req, res) {
  var action  = req.originalUrl.split("\/")[1]
    , name = req.params["name"]

  var options = {
    'action': action,
    'name': name,
  };

  virt.actions(options, function (err, status) {
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = err
    } else {
      resCode = 200;
      msg = status;
    }
    res.json(resCode, msg);
  });
};

VirtController.prototype.hostStats = function (req, res) {
  console.log("VirtController - hostStats");
  var route  = req.originalUrl.split("\/")[1];

  virt.hostStats(function (err, status) {
    console.log("virt.hostStats - callback");
    console.log("err: ", err);
    console.log("status: ", status);
    var msg = {};
    if (err && err.length) {
      resCode = 400;
      msg.err = err;
    } else {
      resCode = 200;
      msg = status; // "this" references express
    }
    console.log("sending response to the client: ", msg);
    res.json(resCode, msg);
  });
}

VirtController.prototype.list = function (req, res) {
  var headers = req.headers
    , ip = headers.host && headers.host.split(":")[0] 
  
  var options = {
    ip: ip,
  };

  virt.list(options, function (err, list) {
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = err;
    } else {
      resCode = 200;
      msg = list; // this references express
    }
    res.json(resCode, msg);
  });
};

module.exports.inject = function(di) {
   if (!_virtController) {
    virt = di.virtModel
    Step = di.Step;
    _ = di._;
    _virtController = new VirtController(di.config.logger);
  }

  return _virtController;
}