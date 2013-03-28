var Step
  , fs
  , _
  , logger
  , daemonFactory
  , helper;

var DaemonManagement = function (config) {
}


DaemonManagement.prototype.daemonsView = function (req, res) {
  res.render("daemon-management/daemons-index.jade", {});
} 

DaemonManagement.prototype.list = function (req, res) {
  helper.getDaemonsIp(function (err, ips) {
    var msg = {};
    if (err) {
      logger.error(err.toString(), {file: __filename, line: __line});
      resCode = 400;
      msg = err.toString();
    } else {
      resCode = 200;
      msg = ips;
    }
    res.json(resCode, msg);

  });
};

DaemonManagement.prototype.add = function (req, res) {
  var ip = req.body['ip']

  var daemon = daemonFactory.createDaemon({ip: ip});
  daemon.save(function (err) {
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = "Something went wrong while creating a new daemon.";
    } else {
      resCode = 200;
      msg.daemon = daemon; // this references express
    }
    res.json(resCode, msg);
  });
};

DaemonManagement.prototype.update = function (req, res) {
  var newIp = req.params['ip']
    , oldIp = req.body['ip']

  var daemon = daemonFactory.createDaemon({ip: oldIp});
  daemon.update({'newIp': newIp}, function (err) {
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = "Something went wrong while updating the daemon.";
    } else {
      resCode = 200;
      msg.daemon = daemon; // this references express
    }
    res.json(resCode, msg);
  });  
};

DaemonManagement.prototype.delete = function (req, res) {
  var ip = req.params['ip']

  helper.deleteDaemon({ip: ip}, function (err) {
    var msg = {};
    if (err) {
      resCode = 400;
      msg.err = "Something went wrong while deleting the daemon.";
    } else {
      resCode = 200;
      msg.daemon = "Should send the deleted daemon obj";
    }
    res.json(resCode, msg);
  })
};

DaemonManagement.prototype.upload = function (req, res) {
  var files = req.files
    , file = files && files.file
    , filename = req.body.filename


  if (!file) {
    res.json(400, "Missing file. Please try again.");
    return;
  }

  var path = "./" + file.path
    , rawFile = fs.readFileSync(path,'utf8')

  try {
    var parsedFile = JSON.parse(rawFile)
  } catch (e) {
    res.send(400, "Failed to parse the file. Please check the format and try again.")
    return;
  }
  
  var hosts = parsedFile.hosts
    , msg = {}
    , hostsLen = hosts && hosts.length || 0;

  if (!hostsLen) {
    res.send(400, "File was empty. Please try again.");
    return;
  }

  _.each(hosts, function (host) {
    (function (host) {
      var daemon = daemonFactory.createDaemon({ip: host});
      daemon.save(function (err) {
        if (err) {
          msg[host] = err;
        } else {
          msg[host] = false;
        }
        if(!--hostsLen) {
          res.json(msg);
        } 

      });
    })(host);
  });
}

module.exports.inject = function(di) {
  logger = di.logger;
  helper = di.helper;
  Step = di.Step;
  fs = di.fs
  _ = di._;
  daemonFactory = di.daemonFactory;
  return new DaemonManagement(di.config);
}