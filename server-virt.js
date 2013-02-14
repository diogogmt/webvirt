
var exec = require('child_process').exec
  , Step = require('step')
  , client = require("./db-conn").client
  , http = require('http')
  , request = require('request')
  , _ = require('underscore')
  , logger;


var helper = {

  getDaemonsIp: function (cb) {
    console.log("getHostIps");

    var sendResponse = function (err) {
      cb(err, null);
    }

    Step([
      function getIps () {
        logger.info("getIps", {file: __filename, line: __line});
        client.keys("hosts:*", this);
      },

      function parseIps (err, keys) {
        logger.info("parseIps", {file: __filename, line: __line});
        var step = this;
        // Log error. Fire callback. Exit Step chain
        if (err) {
          logger.error(err, {file: __filename, line: __line});
          helper.sendResponse(err);
          this.exitChain();
          cb(err, null);
          return;
        }
        var step = this;
        console.log("keys: ", keys);
        _.map(keys, function (key) {
          client.hget(key, "type", step.parallel(key.split(":")[1]));
        });

      },

     function queryIps () {
      var step = this;
      logger.info("queryIps", {file: __filename, line: __line});
      // Iterate on all the saved hosts
      var hosts =  _.without(_.map(_.rest(arguments), function (host) {
        var ip    = host[0]
          , err   = host[1]
          , type  = host[2];
        
        // Type of the host. Default means it is not hosting libvirt.
        if (type !== "default") return host[0] ;
      }), undefined);

      cb(null, hosts); 
    },

    ], sendResponse, false);
  }
};

// Add error checking code 
function Virt (data) {
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
        body.ip = ip;
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
  helper.getDaemonsIp(function (err, ips) {
    console.log("getDaemonsIp callback");
    // console.log("err: ", err);
    console.log("ips: ", ips);
    var data = {
      ips: ips,
      route: "list/vms"
    };
    that.callDaemons(data, cb);
  });
}

Virt.prototype.listDaemons = function (cb) {
  logger.info("Virt Server - listDaemons", {file: __filename, line: __line});
  helper.getDaemonsIp(function (err, ips) {
    console.log("getDaemonsIp callback");
    console.log("ips: ", ips);
    cb({err: null, data: ips});
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

module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("Server Virt inject");
  return new Virt({
    interfaceServerPort: di.config.interfaceServerPort,
    daemonPort: di.config.daemonPort
  });
}