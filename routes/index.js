
// virt can't be a member of Controller because when the Controller methods are invoked they have a different 'this'
// a possible reason for this problem is that the Controller methods are being used as express callback for the API routes
var virt;
var logger;
var Controller = function (di) {
  logger.info("Controller");
  virt = di.config.type === "server"
    ? require("../server-virt.js").inject(di)
    : require("../client-virt.js").inject(di);
}

Controller.prototype.index = function (req, res) {
  res.render('index', { title: 'Express' });
};

Controller.prototype.list = function (req, res) {
  logger.info("Controller list");
  virt.list(function (err, list) {
    if (err) {
      logger.error(err, {file: __filename, line: __line});
    }
    res.json(list);
  });
};

Controller.prototype.listDaemons = function (req, res) {
  logger.info("Controller listDaemons");
  console.log("virt: ", virt);
  virt.listDaemons(function (err, list) {
    if (err) {
      logger.error(err, {file: __filename, line: __line});
    }
    res.json(list);
  });
};

Controller.prototype.listDaemonDetails = function (req, res) {
  logger.info("Controller listDaemonDetails");
  console.log("req.params: ", req.params);
  var ip = req.params["ip"] || null;
  var routePieces  = req.originalUrl.split("\/");
  var route = routePieces[1] + "/" + routePieces[2]; 

  console.log("route: ", route);
  var vmInfo = {
    ip: ip,
    route: route
  };
  virt.listDaemonDetails(vmInfo, function (err, list) {
    if (err) {
      logger.error(err, {file: __filename, line: __line});
    }
    res.json(list);
  });
};


Controller.prototype.actions = function (req,res) {
  console.log("Controller actions");
  var route  = req.originalUrl.split("\/")[1];
  var name = req.params["name"];
  console.log("req.params: ", req.params);
  var vmInfo = {
    name: name,
    ip: req.params["ip"] || null,
    route: route + "/" + name
  };
 
  // Validate virtual machine name and/or ip?
  if (false) {
    logger.error("Invalid virtual machine information", {file: __filename, line: __line});
    res.send({error: 1});
    return;
  }
  console.log("virt: ", virt);
  virt.actions(route, vmInfo, function (err, status) {
    res.json(status);
  });
}

module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("Controller inject");
  return new Controller(di);
}

