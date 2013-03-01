
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

Virt.prototype.callDaemons = function (requestInfo, cb) {
  var r = requestInfo || {}
    , hosts = []
    , self = this
    , route = r.route
    , daemons = r.ips;

  Step([

    function getData () {
      var step = this
        , url;
      _.map(daemons, function (ip) {
        url = "http://" + ip + ":" + self.daemonPort + "/" + route;
        request({ url: url, json: true}, step.parallel(ip));
      });   
    },

    function parseData () {
      resDaemons = _.map(arguments, function (response) {
        var ip    = response[0]
          , err   = response[1]
          , res   = response[2]
          , body  = response[3] || {};

        if (err) {
          logger.error(err, {file: __filename, line: __line});
          body.err = err.toString();
          body.data = null;
        }
        return body;
      });

      if (resDaemons.length === 1) {
        resDaemons = resDaemons[0];
      }

      cb(resDaemons); 
    }

  ], helper.handleStepException("Step error at VirtServer::callDaemons - file: " + __filename + "line: " + __line, cb), false);
}


Virt.prototype.listSingle = function (info, cb) {
  this.callDaemons(info, cb);
}

Virt.prototype.listGroup = function (cb) {
  var that = this;
  helper.getDaemonsIp(function (err, ips) {
    if (err) {
      logger.error("Failed to get daemon Ips.", {file: __filename, line: __line});
      res.json({err: 1});
      return;
    }

    var info = {
      ips: ips,
      route: "list/vms"
    };
    that.callDaemons(info, cb);
  });
}


Virt.prototype.actions = function (action, data, cb) {
  this.callDaemons(data, cb);
}

Virt.prototype.version = function (data, cb) {
  this.callDaemons(data, cb);
}

Virt.prototype.cpu = function (data, cb) {
  this.callDaemons(data, cb);
}

Virt.prototype.mem = function (data, cb) {
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