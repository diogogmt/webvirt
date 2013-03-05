
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
  var self = this;

  helper.getDaemonsIp(function(err, hosts) {
    var msg = {};
    if (err) {
      cb(err);
      return;
    }
    // Each host needs to make 3 calls to get all info about libvirt
    // We sould abstract this logic to the virt-client obj
    var hostsLength = hosts && hosts.length || 0
      , callbacksToRun = hostsLength * 3
      , models = [];

    while(hostsLength--) {
      var ip = hosts[hostsLength];

      (function (index) {
        models[index] = {
          'ip': ip
        };
        var statsCb = function (err, stats) {
          console.log("statsCb - callback for element: ", index);
          stats = stats || {};
          console.log("err: ", err);
          console.log("stats: ", stats);

          if (err) { // Check for error
            models[index].err = err.toString();
          }else if (stats.idle && stats.usage) { // Get CPU info
            models[index].cpuIdle = stats.idle;
            models[index].cpuUsed = stats.usage;
          } else if (stats.free && stats.total) { // Get MEM info
            models[index].memFree = stats.free;
            models[index].memUsed = stats.total - stats.free;
          } else if (stats.hypervisor) { // Get VERSION info
            models[index].hypervisor = stats.hypervisor;
          }

          ! --callbacksToRun && cb(models);
        }

        var vmInfo = {
          ips: [ip]
        };
        // Get CPU info
        vmInfo.route = "stats\/cpu";
        virt.cpu(vmInfo, statsCb);
        // Get MEM info
        vmInfo.route = "stats\/mem";
        virt.mem(vmInfo, statsCb);
        // Get VERSION info
        vmInfo.route = "stats\/version";
        virt.version(vmInfo, statsCb);

      })(hostsLength);
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
