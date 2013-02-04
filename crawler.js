var exec = require('child_process').exec
  , Step = require('step')
  , client = require("./db-conn").client;


module.exports = exports = NetworkScanner;

function NetworkScanner () {
  this.networkRegex = /10\.0\.0\.[0-9]*/g;
}


// Scan network for active hosts
NetworkScanner.prototype.searchHosts = function (cb) {
  console.log("serchHosts");
  exec("sudo nmap -sP  --version-light --open --privileged 10.0.0.0/24", cb);
}


// Save active hosts
NetworkScanner.prototype.saveHosts = function (hosts, cb) {
  console.log("saveHosts");
  var hosts = hosts.match(this.networkRegex);

  var numberHosts = hosts.length;
  while (host = hosts.pop()) {
    console.log("saving default host with IP: ", host);
    var key = "hosts:" + host;     
    client.multi()
      .hset(key, "ip", host)
      .hset(key, "status", "on")
      .hset(key, "type", "default")
      .hset(key, "lastOn", "timestamp")
      .exec(function (err, replies) {
        !--numberHosts && cb();
      }
  }
};


// Scan port of active hosts
NetworkScanner.prototype.searchComputeNodes = function (cb) {
  console.log("searchComputeNodes");
  var hosts = new Array();
  client.keys("hosts:*", function (err, keys) {
    var keysLength = keys.length - 1; // 0 index
    keys.forEach(function (val, index) {
      console.log(index, " - adding hosts ", val, " to the list");
      hosts.push(val.split(":")[1]);
      if (index === keysLength) {
        exec("sudo nmap --version-light --open --privileged -p 80 " + hosts.join(" ") + "", cb);    
      }
    });
  });
};


// Save compute nodes
NetworkScanner.prototype.saveComputeNodes = function (computeNodes, cb) {
  computeNodes = computeNodes.match(this.networkRegex);
  var computeNodesLength = computeNodes.length - 1; // 0 index
  computeNodes.forEach(function (val, index) {
    console.log("saving compute node with IP: ", val);
    client.hset("hosts:" + val, "type", "compute");
  })
};


// Search for active hosts as well compute nodes
NetworkScanner.prototype.fullScann = function (cb) {
  var self = this;
  Step(
    function searchHostsStep () {
      console.log("searchHostsStep");
      self.searchHosts(this);
    },

    function saveHostsStep (error, stdout, stderr) {
      console.log("saveHostsStep");
      self.saveHosts(stdout, this);
    },

    function serchComputeNodesStep () {
      console.log("searchComputeNodesStep");
      self.searchComputeNodes(this);
    },

    function saveComputeNodesStep (error, stdout, stderr) {
      console.log("saveComputeNodesStep");
      self.saveComputeNodes(stdout, cb);
    }
  );
};

// Check if compute nodes are still online
var checkComputeCodes = function () {}






