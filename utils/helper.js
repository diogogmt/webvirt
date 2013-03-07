var Step
  , client
  , _
  , logger
  , bcrypt
  , scrypt
  , _helper;


var Helper = function () {

}

Helper.prototype.getDaemonsIp = function (cb) {
  var self = this;
  Step([
    function getIps () {
      client.keys("hosts:*", this);
    },

    function parseIps (err, keys) {
      var step = this;
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        this.exitChain();
        cb(err);
        return;
      }
      _.map(keys, function (key) {
        client.hget(key, "type", step.parallel(key.split(":")[1]));
      });

    },

   function queryIps () {
    console.log("queryIps");
    var step = this;
    var hosts =  _.without(_.map(arguments, function (host) {
      var ip    = host[0]
        , err   = host[1]
        , type  = host[2];
      
      // Type of the host. Default means it is not hosting libvirt.
      if (type !== "default") return host[0] ;
    }), undefined);
    if (cb) {
      cb(null, hosts); 
    }
  },

  ], self.handleStepException("Step error at Helper::getDaemonsIp - file: " + __filename + "line: " + __line, cb), false); 
}


Helper.prototype.addDaemon = function (opts, cbb) {
  console.log("helper addDaemon");
  var ip = opts && opts.ip || null
    , hashKey = "hosts:" + ip;

  client.multi()
    .hset(hashKey, "ip", ip)
    .hset(hashKey, "status", "on")
    .hset(hashKey, "type", "compute")
    .hset(hashKey, "lastOn", "timestamp")
    .exec(function (err, results) {
      console.log("args: ", arguments);
      cbb(err);
    });
};

Helper.prototype.deleteDaemon = function (opts, cb) {
  console.log("helper deleteDaemon");
  var ip = opts && opts.ip || null
    , hashKey = "hosts:" + ip
    , self = this

  Step([
    function deleteDaemon () {
      var step = this;
      client.del(hashKey, step);
    },

    function confirmDeletion (err, status) {
      if (err) {
        logger.error(err, {file: __filename, line: __line});
      }
      cb(err);
    }
  ], self.handleStepException("Step error at Helper::deleteDaemon - file: " + __filename + "line: " + __line, cb), false); 
};

Helper.prototype.validateIp = function (ip) {
  return ip && ip.match(/^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/);
};

Helper.prototype.handleStepException = function (msg, cb) {
  return function (fnName, err) {
    logger.error(err + " at " + fnName + " - " + msg);    
    cb({err: 1});    
  }
}

Helper.prototype.createUser = function (opts, cb) {
  var hashKey = opts.hashKey || null
    , password = opts.password || null
    , scryptConfig = opts.scryptConfig || {}
    , maxtime =  scryptConfig.maxtime
    , maxmem = scryptConfig.maxmem
    , maxmemfrac = scryptConfig.maxmemfrac

  console.log("hashKey: ", hashKey);
  console.log("password: ", password);

  bcrypt.genSalt(100, function (err, salt) {
    var saltLength = salt.length;
    var saltedPass = salt.slice(0,saltLength / 2) + password + salt.slice(saltLength / 2, saltLength);

    scrypt.passwordHash(saltedPass, maxtime, maxmem, maxmemfrac, function(err, scryptHash) {
      client.multi()
        .hset(hashKey, "password", scryptHash)
        .hset(hashKey, "salt", salt)
        .exec(function (err, status) {
          console.log("Step confirmCreation");
          cb(err, status);
        });
    });
  });
}


module.exports.inject = function(di) {
  if (!_helper) {
    logger = di.logger;
    Step = di.Step;
    _ = di._;
    client = di.client;
    bcrypt = di.bcrypt;
    scrypt = di.scrypt;
    _helper = new Helper();
  }

  return _helper;

}