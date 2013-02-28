
// virt can't be a member of Controller because when the Controller methods are invoked they have a different 'this'
// a possible reason for this problem is that the Controller methods are being used as express callback for the API routes
var virt;
var logger;
var Step = require('step');
var _ = require('underscore');
var helper;



var Controller = function (di) {
  logger.info("Controller");
  // console.log("di: ", di);
  virt = di.config.type === "server"
    ? require("../models/virt-server.js").inject(di)
    : require("../models/virt-client.js").inject(di);
};

Controller.prototype.index = function (req, res) {
  res.render('index', { title: 'Express' });
};

Controller.prototype.listSingle = function (req, res) {
  logger.info("Controller list single");
  var ip = req.params["ip"] || req.headers.host.split(":")[0];
  var vmInfo = {
    ips: [ip],
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
};

Controller.prototype.version = function (req,res) {
  console.log("Controller version");
  var routePieces  = req.originalUrl.split("\/");
  var vmInfo = {
    ips: [req.params["ip"]],
    route: routePieces[1] + "\/" + routePieces[2]
  };
 
  virt.version(vmInfo, function (status) {
    console.log("version callback");
    console.log("status: ", status);
    res.json(status);
  });
};

Controller.prototype.cpuStats = function (req,res) {
  console.log("Controller cpuStats");
  var routePieces  = req.originalUrl.split("\/");
  var vmInfo = {
    ips: [req.params["ip"]],
    route: routePieces[1] + "\/" + routePieces[2]
  };
 
  virt.cpuStats(vmInfo, function (status) {
    console.log("cpuStats callback callback");
    console.log("status: ", status);
    res.json(status);
  });
};

Controller.prototype.memStats = function (req,res) {
  console.log("Controller memStats");
  var routePieces  = req.originalUrl.split("\/");
  console.log("req.params: ", req.params);
  console.log("req.originalUrl: ", req.originalUrl);
  console.log("routePieces: ", routePieces);
  var vmInfo = {
    ips: [req.params["ip"]],
    route: routePieces[1] + "\/" + routePieces[2]
  };
 
  virt.memStats(vmInfo, function (status) {
    console.log("memStats callback callback");
    console.log("status: ", status);
    res.json(status);
  });
};

Controller.prototype.hostToModel = function(req,res) {
  console.log("Controller hostToModel");

  var hostIps;
  var models = [];
  var counter;

  var responseCounter = function() {
    counter--;
    if (!counter) {
      res.json(models);
    }
  }

  // Collect host IPs
  helper.getDaemonsIp(function(err, ips) {
    hostIps = ips;
    console.log("Host IPs COllected:");
    console.log(hostIps);
    counter = ips.length;

    _.each(hostIps,
     function(element, index, list) {
      var model = {};
          model.ip = element;

      console.log("each: ")
      console.log(element);
      console.log(index);
      console.log(list);
      Step([
        function pullCpuInfo () {
          var step = this;

          var vmInfo = {
            ips: [element],
            route: "stats\/cpu\/" 
          };
  
          console.log("pullCPUinfo: ")
          console.log(vmInfo);



          virt.cpuStats(vmInfo, step);
        },

        function pullMemInfo (status) {
          var step = this;

          console.log("cpuStats callback callback");
          console.log("status: ", status);
          model.cpuIdle = status.idle;
          model.cpuUsed = status.usage;

          var vmInfo = {
            ips: [element],
            route: "stats\/mem\/" 
          };
         
          virt.memStats(vmInfo, step);
        },

        function pullVersionInfo(status) {
          var step = this;

          console.log("memStats callback callback");
          console.log("statusz: ", status);
          model.memFree = status.free;
          model.memUsed = (status.total) - (status.free);

          var vmInfo = {
            ips: [element],
            route: "stats\/version\/"
          };
          virt.version(vmInfo, step);
        },

        function finalStep(status) {
          console.log("version callback");
          console.log("status: ", status);
          model.hypervisor = status.hypervisor;

          models.push(model);
          
          // Check for final host
          responseCounter();
        }
      ], function(error){console.log("BLARRG"); logger.error(error, {file: __filename, line: __line})}, false);
    }, this);

  });




};

module.exports.inject = function(di) {
  console.log("VirtManager inject");
  logger = di.logger;
  helper = di.helper;
  logger.info("Controller inject");
  return new Controller(di);
}

