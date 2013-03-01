
var logger
  , Step
  , _
  , helper;


var Controller = function (di) {

};

Controller.prototype.listSingle = function (req, res) {
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

Controller.prototype.listGroup = function (req, res) {
  virt.listGroup(function (list) {
    return res.json(list);
  });
};


Controller.prototype.listDaemons = function (req, res) {
  virt.listDaemons(function (list) {
    res.json(list);
  });
};

Controller.prototype.actions = function (req, res) {
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


Controller.prototype.stats = function (req, res) {
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
  // Init dependencies
  virt = di.config.type === "server"
    ? require("../models/virt-server.js").inject(di)
    : require("../models/virt-client.js").inject(di);
  helper = di.helper;
  Step = di.Step;
  _ = di._;
  logger = di.logger;
  
  return new Controller(di);
}

