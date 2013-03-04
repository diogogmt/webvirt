
var exec = require('child_process').exec
  , Step = require('step')
  , client = require("../../../db-conn").client
  , http = require('http')
  , request = require('request')
  , _ = require('underscore')
  , helper
  , logger;



// Add error checking code 
function Virt (data) {
  console.log("Virt");
  this.interfaceServerPort = data.interfaceServerPort;
  this.daemonPort = data.daemonPort;
  console.log("interfaceServerPort: ", this.interfaceServerPort);
  console.log("daemonPort: ", this.daemonPort);

}

Virt.prototype.callDaemons = function (requestInfo, cb) {
  logger.info("Virt Server - callDaemons", {file: __filename, line: __line});
  // Add error checking

  var r = requestInfo || {}
    , hosts = []
    , self = this
    , route = r.route
    , daemons = r.ips;

  console.log("r: ", r);
  console.log("route: ", route);
  console.log("daemons: ", daemons);
  var sendResponse = function (err) {
    logger.error(err, {file: __filename, line: __line});
    cb(err, null);
  };

  Step([
    function getData () {
      logger.info("getData", {file: __filename, line: __line});
      var step = this;
      _.map(daemons, function (ip) {
        console.log("ip: ", ip);
        var url = "http://" + ip + ":" + self.daemonPort + "/" + route;
        console.log("url: ", url);
        request({ url: url, json: true}, step.parallel(ip));
      });   
    },

    function parseData () {
      logger.info("parseData", {file: __filename, line: __line});

      resDaemons = _.map(arguments, function (response) {
        console.log("\n\n.map:\n");
        var ip    = response[0]
          , err   = response[1]
          , res   = response[2]
          , body  = response[3] || {};
        console.log("ip: ", ip);
        console.log("body: ", body);
        console.log("err: ", err);
        if (err) {
          logger.error(err, {file: __filename, line: __line});
          body.err = err.toString();
          body.data = null;
        }
        // body.ip = ip;
        console.log("body: ", body);
        return body;
      });

      if (resDaemons.length === 1) {
        resDaemons = resDaemons[0];
      }
      console.log("\n\nresDaemons: ", resDaemons);

      cb(resDaemons); 
    }
  ], sendResponse, false);
}


Virt.prototype.listSingle = function (info, cb) {
  logger.info("Virt Server - listSingle", {file: __filename, line: __line});
  this.callDaemons(info, cb);
}

Virt.prototype.listGroup = function (cb) {
  logger.info("Virt Server - listGroup", {file: __filename, line: __line});
  var that = this;
  console.log("helper: ", helper);
  helper.getDaemonsIp(function (err, ips) {
    console.log("getDaemonsIp callback");

    if (err) {
      logger.error("Failed to get daemon Ips.", {file: __filename, line: __line});
      res.json({err: 1});
      return;
    }

    console.log("ips: ", ips);
    var data = {
      ips: ips,
      route: "list/vms"
    };
    that.callDaemons(data, cb);
  });
}


Virt.prototype.actions = function (action, data, cb) {
  logger.info("Virt Server -  actions - " + action, {file: __filename, line: __line});
  this.callDaemons(data, cb);
}

Virt.prototype.version = function (data, cb) {
  logger.info("Virt Server -  version", {file: __filename, line: __line});
  this.callDaemons(data, cb);
}

Virt.prototype.cpuStats = function (data, cb) {
  logger.info("Virt Server -  cpuStats", {file: __filename, line: __line});
  this.callDaemons(data, cb);
}

Virt.prototype.memStats = function (data, cb) {
  logger.info("Virt Server -  memStats", {file: __filename, line: __line});
  this.callDaemons(data, cb);
}

module.exports.inject = function(di) {
  logger = di.logger;
  helper = di.helper;
  logger.info("Server Virt inject");
  return new Virt({
    interfaceServerPort: di.config.interfaceServerPort,
    daemonPort: di.config.daemonPort
  });
}