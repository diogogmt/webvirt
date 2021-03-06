
var exec
  , Step
  , client
  , http
  , request
  , _
  , helper
  , logger
  , _virt;


function Virt (opt) {
  this.interfaceServerPort = opt.interfaceServerPort;
  this.daemonPort = opt.daemonPort;
}

Virt.prototype.actions = function (options, cb) {
  console.log("Virt.actions");
  this.callDaemons(options, cb);
}

Virt.prototype.cpu = function (data, cb) {
  this.callDaemons(data, cb);
}

Virt.prototype.callDaemons = function (requestInfo, cb) {
  console.log("Virt.callDaemons");
  console.log("requestInfo: ", requestInfo);
  var r = requestInfo || {}
    , hosts = []
    , self = this
    , route = r.route
    , ip = r.ip;

  Step([
    function getData () {
      console.log("Step getData");
      var step = this;
      var url = "http://" + ip + ":" + self.daemonPort + "/" + route;
      request(
        {
          url: url,
          json: true,
          timeout:4000
        },
        step);
    },

    function parseData (err, response, body) {
      console.log("Step parseData")
      var statusCode = response && response.statusCode || 400;
      var body = body || {};

      if (statusCode == 400 && !err) {
        err = body.err;
      }

      console.log("statusCode: ", statusCode);
      console.log("body: ", body);
      console.log("err: ", err);

      body.ip = ip;
      cb(err, body); 
    }

  ], helper.handleStepException("Step error at VirtServer::callDaemons - file: " + __filename + "line: " + __line, cb), false);
}

Virt.prototype.hostStats = function (options, cb) {
  console.log("Virt.hostStats");
  this.callDaemons(options, cb);
}

Virt.prototype.listSingle = function (info, cb) {
  this.callDaemons(info, cb);
}

Virt.prototype.listGroup = function (cb) {
  var that = this;
  helper.getDaemonsIp(function (err, ips) {
    if (err) {
      logger.error("Failed to get daemon Ips.", {file: __filename, line: __line});
      cb({err: "Failed to get host ips. Please try again."});
      return;
    }

    var info = {
          route: "list/vms"
        }
      , waitForCallbacks = ips && ips.length || 0
      , response = []

    _.each(ips, function (element) {
      info.ip = element;
      that.callDaemons(info, function (err, list) {
        var msg = {};
        if (err) {
          msg.ip = element;
          msg.err = err.toString();
        } else {
          msg = list;
        }
        response.push(msg);
        !--waitForCallbacks && cb(response)
      }); // end callDaemons
    }); // end each
  }); // end getDaemonsIp
}

Virt.prototype.mem = function (data, cb) {
  this.callDaemons(data, cb);
}

Virt.prototype.version = function (data, cb) {
  this.callDaemons(data, cb);
}

module.exports.inject = function(di) {

  // Inject dependencies
  exec = di.exec;
  Step = di.Step;
  client = di.client;
  http = di.http;
  request = di.request;
  _ = di._;
  logger = di.logger;
  helper = di.helper;


  if (!_virt) {
    _virt = new Virt({
      interfaceServerPort: di.config.interfaceServerPort,
      daemonPort: di.config.daemonPort
    });
  }
  return _virt;
}
