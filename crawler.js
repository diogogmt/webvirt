var exec = require('child_process').exec
  , Step = require('step')
  , _ = require('underscore')
  , client = require("./db-conn").client;


module.exports = exports = NetworkScanner;


function NetworkScanner () {
  this.networkRegex = /10\.0\.0\.[0-9]*/g;
  this.networkId = "10.0.0.0";
  this.subnetMask = "24";
  this.portNumber = "4000";
}


// Search for active hosts as well compute nodes
NetworkScanner.prototype.networkScan = function (cb) {
  console.log("NetworkScanner networkScann");
  var self = this;

  var sendResponse = function (err) {
    cb(err, null);
  };

  Step([
    function searchHostsStep () {
      console.log("searchHostsStep");
      self.searchHosts(this);
    },

    function saveHostsStep (error, stdout, stderr) {
      console.log("saveHostsStep");
      if (error) {
        logger.error(error, {file: __filename, line: __line});
        sendResponse(error);
        this.exitChain();
        return;
      }
      self.saveHosts(stdout, this);
    },

    function serchDaemonsStep () {
      console.log("searchDaemonsStep");
      self.searchDaemons(this);
    },

    function saveDaemonsStep (error, stdout, stderr) {
      console.log("saveDaemonsStep");
      if (error) {
        logger.error(error, {file: __filename, line: __line});
        sendResponse(error);
        this.exitChain();
        return;
      }
      self.saveDaemons(stdout, cb);
    }
  ], sendResponse, false);
};


// Search for active hosts as well compute nodes
NetworkScanner.prototype.daemonScan = function (cb) {
  console.log("NetworkScanner daemonScann");
  var self = this;

  var sendResponse = function (err) {
    cb(err, null);
  };

  Step([
    function serchDaemonsStep () {
      console.log("searchDaemonsStep");
      self.searchDaemons(this);
    },

    function saveDaemonsStep (error, stdout, stderr) {
      console.log("saveDaemonsStep");
      if (error) {
        logger.error(error, {file: __filename, line: __line});
        sendResponse(error);
        this.exitChain();
        return;
      }
      self.saveDaemons(stdout, cb);
    }
  ], sendResponse, false);
};


// Scan network for active hosts
NetworkScanner.prototype.searchHosts = function (cb) {
  console.log("serchHosts");
  exec("sudo nmap -sP  --version-light --open --privileged "
    + this.networkId
    + "/" + this.subnetMask, cb);
};


// Save active hosts
NetworkScanner.prototype.saveHosts = function (hosts, cb) {
  console.log("saveHosts");
  hosts = hosts.match(this.networkRegex);

  var multiCb = function (err, replies) {
    if (err) {
      logger.error(err, {file: __filename, line: __line});
    }
    !--numberHosts && cb();
  };
  var host;
  var numberHosts = hosts.length;
  while (host = hosts.pop()) {
    console.log("saving default host with IP: ", host);
    var key = "hosts:" + host;     
    client.multi()
      .hset(key, "ip", host)
      .hset(key, "status", "on")
      .hset(key, "type", "default")
      .hset(key, "lastOn", "timestamp")
      .exec(multiCb);
  }
};


// Scan port of active hosts
NetworkScanner.prototype.searchDaemons = function (cb) {
  console.log("searchDaemons");
  var hosts = [];
  var self = this;
  client.keys("hosts:*", function (err, keys) {
    console.log("keys: ", keys);
    var keysLength = keys.length - 1; // 0 index
    keys.forEach(function (val, index) {
      console.log(index, " - adding hosts ", val, " to the list");
      hosts.push(val.split(":")[1]);
      if (index === keysLength) {
        exec("sudo nmap --version-light --open --privileged -p " 
          + self.portNumber + " "
          +  hosts.join(" ") + "", cb);    
      }
    });
  });
};


// Save compute nodes
NetworkScanner.prototype.saveDaemons = function (daemons, cb) {
  console.log("NetworkScanner saveDaemons");
  var self = this;

  var sendResponse = function (err) {
    cb(err, null);
  };

  Step([
    function grep () {
      console.log("grep");
      exec("echo \"" +  daemons + "\" | grep closed", this);
    },

    function save (err, stdout, stderr) {
      console.log("save");
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        sendResponse(err);
        this.exitChain();
        return;
      }

      var hosts = stdout.match(self.networkRegex);    
      daemons   =  _.difference(daemons.match(self.networkRegex), hosts);
      var daemonsLength = daemons.length; // 0 index
      console.log("daemons: ", daemons);
      
      // Add error checking
      var hsetCb = function () {
        !--daemonsLength && cb(null, daemons);
      }

      daemons.forEach(function (val, index) {
        console.log("saving daemon with IP: ", val);
        client.hset("hosts:" + val, "type", "compute", hsetCb);
      });
    }
  ], sendResponse, false);
};

// Check if compute nodes are still online
var checkComputeCodes = function () {};

