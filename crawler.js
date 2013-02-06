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
NetworkScanner.prototype.searchComputeNodes = function (cb) {
  console.log("searchComputeNodes");
  var hosts = [];
  var self = this;
  client.keys("hosts:*", function (err, keys) {
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
NetworkScanner.prototype.saveComputeNodes = function (computeNodes, cb) {
  console.log("NetworkScanner saveComputeNodes");
  var self = this;

  Step(
    function grep () {
      console.log("grep");
      exec("echo \"" +  computeNodes + "\" | grep closed", this);
    },

    function save (err, stdout, stderr) {
      console.log("save");

      var hosts = stdout.match(self.networkRegex);    
      var hypervisors =  _.difference(computeNodes.match(self.networkRegex), hosts);
      var hvLength = hypervisors.length; // 0 index
      console.log("hv: ", hypervisors);
      
      // Add error checking
      var hsetCb = function () {
        !--hvLength && cb();
      }

      hypervisors.forEach(function (val, index) {
        console.log("saving compute node with IP: ", val);
        client.hset("hosts:" + val, "type", "compute", hsetCb);
      });
    }
  );

  

};



// Search for active hosts as well compute nodes
NetworkScanner.prototype.hypervisorScann = function (cb) {
  console.log("NetworkScanner hypervisorScann");
  var self = this;
  Step(
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


// Search for active hosts as well compute nodes
NetworkScanner.prototype.networkScann = function (cb) {
  console.log("NetworkScanner fullScann");
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
      console.log("stdout: ", stdout);
      self.saveComputeNodes(stdout, cb);
    }
  );
};

// Check if compute nodes are still online
var checkComputeCodes = function () {};

