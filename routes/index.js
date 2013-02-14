
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

Controller.prototype.listSingle = function (req, res) {
  logger.info("Controller list single");
  var vmInfo = {
    ips: [req.params["ip"]],
    route: "list/vms"

  };
  virt.listSingle(vmInfo, function (list) {
    return res.json(list);
  });
};

Controller.prototype.listGroup = function (req, res) {
  logger.info("Controller group");

  virt.listGroup(function (list) {
    return res.json(list);
  });
};


Controller.prototype.listDaemons = function (req, res) {
  logger.info("Controller listDaemons");
  console.log("virt: ", virt);
  virt.listDaemons(function (list) {
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
    ips: [req.params["ip"]],
    route: route + "/" + name
  };
 
  // Validate virtual machine name and/or ip?
  if (false) {
    logger.error("Invalid virtual machine information", {file: __filename, line: __line});
    res.send({error: 1});
    return;
  }
  console.log("virt: ", virt);
  virt.actions(route, vmInfo, function (status) {
    res.json(status);
  });
}

Controller.prototype.version = function (req,res) {
  console.log("Controller version");
  var route  = req.originalUrl.split("\/")[1];
  console.log("req.params: ", req.params);
  var vmInfo = {
    ips: [req.params["ip"]],
    route: route
  };
 
  virt.version(vmInfo, function (status) {
    console.log("version callback");
    console.log("status: ", status);
    res.json(status);
  });
}

module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("Controller inject");
  return new Controller(di);
}

