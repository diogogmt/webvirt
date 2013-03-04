
var client
  , Step
  , _
  , fs
  , logger
  , helper;

// Singleton
var _daemonFactory


var Daemon = function (opt) {
  var opt = opt || {};
  this.ip = opt.ip || null
}

Daemon.prototype.save = function (cb) {
  helper.addDaemon({ip: ip}, function (err) {
    cb(err);
  });
}

Daemon.prototype.update = function (opts, cb) {
  var opts = opts || {}
    , newIp = opts.newIp || null
    , self = this;

  Step([
    function deleteDaemon () {
      helper.deleteDaemon({ip: self.ip}, this)
    },

    function updateDaemon (err) {
      var step = this;
      if (err) {
        logger.error("Error deleting daemon with ip - " + self.ip,
          {file: __filename, line: __line});
        this.exitChain();
        cb({err: 1});
        return;
      }

      helper.addDaemon({ip: newIp}, step);
    },

    function confirm (err) {
      if (err) {
        logger.error("Error adding daemon with ip - " + newIp,
          {file: __filename, line: __line});
        err = true;
        this.exitChain();
        return;
      }

      cb({err: err});

    }
  ], helper.handleStepException("Step error at Daemon::update - file: " + __filename + "line: " + __line, cb), false); 
}

var DaemonFactory = function (config) {
  this.scryptConfig = config && config.scryptConfig || {};
}

DaemonFactory.prototype.createUser = function (opt) {
  console.log("UserFactory createUser");
  opt = opt || {};
  opt.scryptConfig = this.scryptConfig;
  return new User(opt);
}

module.exports.inject = function (di) {
  if (!_userFactory) {
    client = di.client;
    Step = di.Step;
    _ = di._;
    fs = di.fs;
    logger = di.logger;
    helper = di.helper;

    _daemonFactory = new DaemonFactory(di.config);
  }
  return _daemonFactory;

}

