
var client
  , Step
  , _
  , logger
  , helper;

// Singleton
var _daemonFactory


var Daemon = function (opt) {
  var opt = opt || {};
  this.ip = opt.ip || null
}

Daemon.prototype.save = function (cb) {
  console.log("Daemon - save");
  var self = this
    , hashKey = "hosts:" + self.ip

  Step([
    function checkIp () {
      console.log("Step checkIp");
      client.hlen(hashKey, this);
    },

    function createDaemon (err, len) {
      console.log("Step creat");
      var step = this;

      if (len) {
        logger.error(len ? "IP " + self.ip + " already exists." : err, {file: __filename, line: __line});
        cb(true);
        this.exitChain();
        return;
      }

      helper.addDaemon({ip: self.ip}, step);
    },

    function confirmCreation (err) {
      console.log("Step confirmCreation");
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      }
      cb(err);
    }
  ], helper.handleStepException("Step error at Daemon::save - file: " + __filename + "line: " + __line, cb), false); 
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
      }
      // Update instance IP
      self.ip = newIp;
      cb(err);

    }
  ], helper.handleStepException("Step error at Daemon::update - file: " + __filename + "line: " + __line, cb), false); 
}

var DaemonFactory = function (config) {
  this.scryptConfig = config && config.scryptConfig || {};
}

DaemonFactory.prototype.createDaemon = function (opt) {
  console.log("DaemonFactory createDaemon");
  return new Daemon(opt);
}

module.exports.inject = function (di) {
  if (!_daemonFactory) {
    client = di.client;
    Step = di.Step;
    _ = di._;
    logger = di.logger;
    helper = di.helper;

    _daemonFactory = new DaemonFactory(di.config);
  }
  return _daemonFactory;

}

