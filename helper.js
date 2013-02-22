var Step = require('step')
  , client = require("./db-conn").client
  , _ = require('underscore')
  , logger;


var Helper = function () {

}

Helper.prototype.getDaemonsIp = function (cb) {
  console.log("getHostIps");

  var handleStepException = function (err) {
    logger.error(err, {file: __filename, line: __line});
    cb({err: 1});
  }

  Step([
    function getIps () {
      logger.info("getIps", {file: __filename, line: __line});
      client.keys("hosts:*", this);
    },

    function parseIps (err, keys) {
      logger.info("parseIps", {file: __filename, line: __line});
      var step = this;
      // Log error. Fire callback. Exit Step chain
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        this.exitChain();
        cb(err, null);
        return;
      }
      var step = this;
      console.log("keys: ", keys);
      _.map(keys, function (key) {
        client.hget(key, "type", step.parallel(key.split(":")[1]));
      });

    },

   function queryIps () {
    var step = this;
    logger.info("queryIps", {file: __filename, line: __line});
    console.log("args: ", arguments);
    // Iterate on all the saved hosts
    var hosts =  _.without(_.map(arguments, function (host) {
      var ip    = host[0]
        , err   = host[1]
        , type  = host[2];
      
      // Type of the host. Default means it is not hosting libvirt.
      if (type !== "default") return host[0] ;
    }), undefined);

    console.log("hosts: ", hosts);

    cb(null, hosts); 
  },

  ], handleStepException, false);
}


Helper.prototype.addDaemon = function (opts, cb) {
  console.log("helper addDaemon");
  var ip = opts && opts.ip || null;

  var hashKey = "hosts:" + ip;
  client.multi()
    .hset(hashKey, "ip", ip)
    .hset(hashKey, "status", "on")
    .hset(hashKey, "type", "compute")
    .hset(hashKey, "lastOn", "timestamp")
    .exec(function () {
      console.log("args: ", arguments);
      var cmdResults = arguments[1] || []
        , cmdLength = cmdResults.length
        , err = 0;
      while (cmdLength--) {
        if (!cmdResults[cmdLength]) {
          logger.error("An error happened while adding a new daemon to the database", 
            {file: __filename, line: __line});
          err = 1;
        }
      }
      cb({err: err});
    });
};

Helper.prototype.deleteDaemon = function (opts, cb) {
  console.log("helper deleteDaemon");
  var ip = opts && opts.ip || null;
  
  var handleStepException = function (err) {
    logger.error(err, {file: __filename, line: __line});
    cb({err: 1});
  }

  var hashKey = "hosts:" + ip;
  Step([
    function deleteDaemon () {
      var step = this;
      client.del(hashKey, step);
    },

    function confirmDeletion (err, status) {
      console.log("args: ", arguments);
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        this.exitChain();
        cb({err: 1});
        return;
      }

      cb({err: 0});
    }
  ], handleStepException);
};


module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("Helper inject");
  return new Helper();
}