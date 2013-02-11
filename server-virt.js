
/**
 * Forward Dec 
 **/


var exec = require('child_process').exec
  , Step = require('step')
  , client = require("./db-conn").client
  , http = require('http')
  , request = require('request')
  , _ = require('underscore')
  , logger;



// Add error checking code 
function Virt (data) {
  this.interfaceServerPort = data.interfaceServerPort;
  this.daemonPort = data.daemonPort;
  console.log("interfaceServerPort: ", this.interfaceServerPort);
  console.log("daemonPort: ", this.daemonPort);

}

Virt.prototype.makeMultipleRequests = function (route, cb) {
  logger.info("Virt Server - makeMultipleRequests");
  var hosts = [];
  var self = this;

  var sendResponse = function (err) {
    cb(err, null);
  };


  Step([
    function getIps () {
      logger.info("getIps", {file: __filename, line: __line});
      client.keys("hosts:*", this);
    },

    function parseIps (err, keys) {
      logger.info("parseIps", {file: __filename, line: __line});
      // Log error. Fire callback. Exit Step chain
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        sendResponse(err);
        this.exitChain();
        return;
      }
      var step = this;

      _.map(keys, function (key) {
        client.hget(key, "type", step.parallel(key.split(":")[1]));
      });

    },

    function queryIps () {
      var step = this;
      logger.info("queryIps", {file: __filename, line: __line});
      // Iterate on all the saved hosts
      _.map(_.rest(arguments), function (host) {
        var ip    = host[0]
          , err   = host[1]
          , type  = host[2];
        
        // Type of the host. Default means it is not hosting libvirt.
        if (type === "default") return;

        var url = "http://" + ip + ":" + self.daemonPort + "/" + route;
        request({ url: url, json: true}, step.parallel(ip));
      });  
    },

    function makeRequests () {
      logger.info("makeRequests", {file: __filename, line: __line});
      var listResponse = [];
      var argsLength = arguments.length;
      // Iterate on the response of the libvirt hosts
      _.map(arguments, function (obj) {
          var ip    = obj[0]
            , err   = obj[1]
            , res   = obj[2]
            , body  = obj[3];

          listResponse.push({
            err: err && err.code || null,
            ip: ip,
            body: body
          });
          // Once all the requets are parsed fire the callback
         !--argsLength && cb(null, listResponse); 
      });
    }
  ], sendResponse, false);
}


Virt.prototype.makeSingleRequest = function (requestInfo, cb) {
  logger.info("Virt Server - makeSingleRequest", {file: __filename, line: __line});
  // Add error checking

  var r = requestInfo || {}
    , hosts = []
    , self = this
    , route = r.route + "/" + r.name
    , ip = r.ip;


  var sendResponse = function (err) {
    cb(err, null);
  };

  Step([
    function getData () {
      logger.info("getData", {file: __filename, line: __line});

      var url = "http://" + ip + ":" + self.daemonPort + "/" + route;
      request({ url: url, json: true}, this);
    },

    function parseData (err, res, body) {
      logger.info("parseData", {file: __filename, line: __line});

      if (err) {
        logger.error(err, {file: __filename, line: __line});
        sendResponse(err, null);
        this.exitChain();
        return;
      }
      var data = {
        ip: ip,
        body: body 
      };

      cb(null, data); 
    }
  ], sendResponse, false);
}


// Combine all the API calls into a single function
Virt.prototype.list = function (cb) {
  logger.info("Virt Server - list", {file: __filename, line: __line});
  this.makeMultipleRequests("list", cb);
}

Virt.prototype.status = function (data, cb) {
  logger.info("Virt Server - status", {file: __filename, line: __line});
  this.makeSingleRequest(data, cb);
}

Virt.prototype.start = function (data, cb) {
  logger.info("Virt Server - start", {file: __filename, line: __line});
  this.makeSingleRequest(data, cb);
}

Virt.prototype.resume = function (data, cb) {
  logger.info("Virt Server - resume", {file: __filename, line: __line});
  this.makeSingleRequest(data, cb);
}

Virt.prototype.suspend = function (data, cb) {
  logger.info("Virt Server - suspend", {file: __filename, line: __line});
  this.makeSingleRequest(data, cb);
}

Virt.prototype.shutdown = function (data, cb) {
  logger.info("Virt Server - shutdown", {file: __filename, line: __line});
  this.makeSingleRequest(data, cb);
}

Virt.prototype.destroy = function (data, cb) {
  logger.info("Virt Server - destory", {file: __filename, line: __line});
  this.makeSingleRequest(data, cb);
}


module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("Server Virt inject");
  return new Virt({
    interfaceServerPort: di.config.interfaceServerPort,
    daemonPort: di.config.daemonPort
  });
}