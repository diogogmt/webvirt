var client
  , Step
  , fs
  , _ 
  , logger
  , helper;

var DaemonManagement = function (config) {
  console.log("DaemonManagement");

}


DaemonManagement.prototype.daemonsView = function (req, res) {
  res.render("daemon-management/daemons-index.jade", {});
} 

DaemonManagement.prototype.list = function (req, res) {
  helper.getDaemonsIp(function (err, ips) {
    if (err) {
      logger.error(err, {file: __filename, line: __line});
      return;
    }

    res.json({err: err, daemons: ips});
  });
};

DaemonManagement.prototype.add = function (req, res) {
  console.log("DaemonManagement - addDaemons");
  var ip = req.body['ip']

  var daemon = daemonFactory.create({ip: ip});
  daemon.save(function (err) {
    res.json(err);
  });
};

DaemonManagement.prototype.update = function (req, res) {
  var newIp = req.params['ip']
    , oldIp = req.body['ip']

  var daemon = daemonFactory.create({ip: oldIp});
  daemon.update({'newIp': newIp}, function (err) {
    res.json(err);
  });  
};

DaemonManagement.prototype.delete = function (req, res) {
  console.log("DaemonManagement - deleteDaemons");

  var params = req.params
    , ip = params['id']
    , hashKey;

  console.log("req.body: ", req.body);
  console.log("req.params: ", req.params);


  // Check if ip is valid
  if (false) {
    logger.error("Trying to update an invalid IP - " + ip, 
      {file: __filename, line: __line});
    res.json({err: 1});
    return;
  }

  helper.deleteDaemon({ip: ip}, function (err) {
    res.json(err);
  })
  var ip = req.params['ip']

  helper.deleteDaemon({ip: ip}, function (err) {
    res.json(err);
  })
  
  
};

DaemonManagement.prototype.upload = function (req, res) {
  var file = req.files.file
    , filename = req.body.filename

  var path = "./" + file.path;
  var rawFile = fs.readFileSync(path,'utf8'); 
  var parsedFile = JSON.parse(rawFile); 

  var hosts = parsedFile.hosts;

  var errors = [];
  var hostsLen = hosts && hosts.length || 0;

  if (!hostsLen) {
    res.json({
      err: "File was empty. Please try again."
    });
    return;
  }

  _.each(hosts, function (host) {
    (function (host) {
      var daemon = daemonFactory.create({ip: host});
      daemon.save(function (error) {
        var error = error.err || false
        errors.push({err: err, ip: host});
        if(!--hostsLen) {
          res.json({data: errors});
        } 
      });
    })(host);
  });
}

module.exports.inject = function(di) {
  logger = di.logger;
  helper = di.helper;
  logger.info("Daemon Management inject");
  return new DaemonManagement(di.config);
}