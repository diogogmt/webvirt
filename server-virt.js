
/**
 * Forward Dec 
 **/


var exec = require('child_process').exec
  , Step = require('step')
  , client = require("./db-conn").client
  , http = require('http')
  , request = require('request')
  , _ = require('underscore');

exports.Virt = Virt;


// Add error checking code 
function Virt () {
  // Portnumber can be set dynamicly;
  this.portNumber = "4000"

}

Virt.prototype.makeMultipleRequests = function (route, cb) {
  console.log("makeRequest");
  var hosts = [];
  var self = this;

  Step(
    function getIps () {
      client.keys("hosts:*", this);
    },

    function parseIps (err, keys) {
      // console.log("args: ", arguments);
      var step = this;

      var test = _.map(keys, function (key) {
          // console.log("map for key ", key);
          client.hget(key, "type", step.parallel(key.split(":")[1]));
          return {test: key};
      });

      console.log("test: ", test);

    },

    function queryIps () {
      console.log("queryIps");
      console.log("args: ", arguments);
      var step = this;
      // console.log("args: ", arguments);
      _.map(_.rest(arguments), function (host) {
        var ip = host[0]
          , err = host[1]
          , type = host[2];
        console.log("ip - ", ip, " - type - ", type);
        
        // Create enum with all api routes
        if (type === "default") return;

        var url = "http://" + ip + ":" + self.portNumber + "/" + route;
        console.log("url: ", url);
        request({ url: url, json: true}, step.parallel(ip));
        // request(url, function (err, res, body) {
        //   console.log("request cb");
        //   // console.log("args: ", arguments)
        // });

      });  
    },

    function makeRequests () {
      console.log("makeRequests");
      var listResponse = [];
      var argsLength = arguments.length;
      _.map(arguments, function (obj) {
        console.log("map");
        var ip = obj[0]
          , err = obj[1]
          , res = obj[2]
          , body = obj[3];

          console.log("res: ", res);

          listResponse.push({
            err: err && err.code || null,
            ip: ip,
            body: body
          });
         !--argsLength && cb(null, listResponse); 

      });
    }
  );
}


Virt.prototype.makeSingleRequest = function (requestInfo, cb) {
  console.log("makeSingleRequest");
  // Add error checking
  var hosts = [];
  var self = this;
  var route = requestInfo.route + "/" + requestInfo.name;
  var ip = requestInfo.ip
  console.log("requestInfo: ", requestInfo);

  Step(
    function getData () {
      console.log("getData");
      var url = "http://" + ip + ":" + self.portNumber + "/" + route;
      console.log("url: ", url);
      request({ url: url, json: true}, this);
    },

    function parseData (err, res, body) {
      console.log("parseData");

      var data = {
        err: err && err.code || null,
        ip: ip,
        body: body 
      };

      cb(null, data); 
    }
  );
}

Virt.prototype.list = function (cb) {
  console.log("Server - Virt list");
  // TODO - create enum with all route names
  this.makeMultipleRequests("list", cb);
} // END-FUNCTION

Virt.prototype.status = function (data, cb) {
  console.log("Server - Virt status");
  this.makeSingleRequest(data, cb);
} // END-FUNCTION

Virt.prototype.start = function (data, cb) {
  console.log("Server - Virt start");
  this.makeSingleRequest(data, cb);
} // END-FUNCTION

Virt.prototype.resume = function (data, cb) {
  console.log("Server - Virt resume");
  this.makeSingleRequest(data, cb);
} // END-FUNCTION

Virt.prototype.suspend = function (data, cb) {
  console.log("Server - Virt suspend");
  this.makeSingleRequest(data, cb);
} // END-FUNCTION

Virt.prototype.shutdown = function (data, cb) {
  console.log("Server - Virt shutdown");
  this.makeSingleRequest(data, cb);
} // END-FUNCTION

Virt.prototype.destroy = function (data, cb) {
  console.log("Server - Virt destory");
  this.makeSingleRequest(data, cb);
} // END-FUNCTION
