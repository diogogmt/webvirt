
var client
  , Step
  , _
  , virt
  , logger
  , helper;

// Singleton
var _hostFactory


var Host = function (opt) {

}

Host.prototype.findAll = function (cb) {
  console.log("Host.findAll");
  var self = this;

  helper.getDaemonsIp(function(err, hosts) {
    var msg = {};
    if (err) {
      cb(err);
      return;
    }

    var hostsLength = hosts && hosts.length || 0
      , models = {
          "hosts": [],
          "err": []
      }
      , callbacksToRun = hostsLength;

    while(hostsLength--) {
      var ip = hosts[hostsLength];

      var options = {
        ip: ip,
        route: "hostStats"
      };

      virt.hostStats(options, function(err, stats) {
        console.log("\n\n****virt.hostStats callback");
        console.log("err: ", err);
        console.log("stats: ", stats);
        
        if (err) {
          stats.err = err.toString();
        } 
        models.hosts.push(stats);
        ! --callbacksToRun && cb(null, models);
      });
    }
  });
}

var HostFactory = function (config) {
}

HostFactory.prototype.createHost = function (opt) {
  return new Host(opt);
}

module.exports.inject = function (di) {
  if (!_hostFactory) {
    client = di.client;
    Step = di.Step;
    _ = di._;
    virt = di.virt;
    logger = di.logger;
    helper = di.helper;


    _hostFactory = new HostFactory(di.config);
  }
  return _hostFactory;

}
