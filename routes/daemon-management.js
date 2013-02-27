var client = require("./../db-conn").client
  , Step = require('step')
  , fs = require('fs')
  , _ = require('underscore')
  , logger
  , helper;

var DaemonManagement = function (config) {
  console.log("DaemonManagement");

}


DaemonManagement.prototype.manageDaemons = function (req, res) {
  console.log("DaemonManagement - listDaemons");
  res.render("daemon-management/daemons-crud", {});
} 

DaemonManagement.prototype.listDaemons = function (req, res) {
  console.log("DaemonManagement - listDaemons");

  var sendResponse = function (msg) {
    res.json(msg);
  }

  helper.getDaemonsIp(function (err, ips) {
    console.log("getDaemonsIp callback");
    if (err) {
      logger.error(err, {file: __filename, line: __line});
      sendResponse({err: true, daemons: null});
      return;
    }

    sendResponse({err: false, daemons: ips});
  });

};

DaemonManagement.prototype.addDaemon = function (req, res) {
  console.log("DaemonManagement - addDaemons");
  var body = req.body
    , ip = body['ip']
    , hashKey;


  // Check if ip is valid
  if (false) {
    logger.error("Trying to add an invalid IP - " + ip, 
      {file: __filename, line: __line});
    res.json({err: 1});
    return;
  }

  helper.addDaemon({ip: ip}, function (err) {
    res.json(err);
  });
  
};

DaemonManagement.prototype.updateDaemon = function (req, res) {
  console.log("DaemonManagement - updateDaemons");
  console.log("req.body: ", req.body);
  console.log("req.params: ", req.params);
  var body = req.body
    , ip = req.params['ip']
    , hashKey;


  // Check if ip is valid
  if (false) {
    logger.error("Trying to update an invalid IP - " + ip, 
      {file: __filename, line: __line});
    res.json({err: 1});
    return;
  }


  var handleStepException = function (err) {
    logger.error(err, {file: __filename, line: __line});
    res.json({err: true});
  }

  var sendResponse = function (msg) {
    res.json(msg);
  }

  hashKey = "hosts:" + ip;
  Step([
    function deleteDaemon () {
      helper.deleteDaemon({ip: ip}, this)
    },

    function updateDaemon (err) {
      if (err) {
        logger.error("Error deleting daemon with ip - " + ip,
          {file: __filename, line: __line});
        this.exitChain();
        sendResponse({err: 1});
        return;
      }

      helper.addDaemon({ip: ip}, this);

    },

    function confirm (err) {
      console.log("confirm");

      if (err) {
        logger.error("Error adding daemon with ip - " + ip,
          {file: __filename, line: __line});
        this.exitChain();
        sendResponse({err: 1});
        return;
      }

      sendResponse({err: 0});

    }
  ], handleStepException);
  
};

DaemonManagement.prototype.deleteDaemon = function (req, res) {
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
  
  
};

DaemonManagement.prototype.uploadDaemon = function (req, res) {
  console.log("DaemonManagement uploadDaemon");

  var file = req.files.file
  , filename = req.body.filename

  console.log("req.files: ", req.files);

  console.log("file: ", file);
  console.log("filename: ", filename);
  var path = "./" + file.path;
  console.log("path: ", path);


  var rawFile = fs.readFileSync(path,'utf8'); 
  var parsedFile = JSON.parse(rawFile); 
  console.log("rawFile: ", rawFile);

  var hosts = parsedFile.hosts;
  console.log("hosts: ", hosts);

  var errors = [];
  var hostsLen = hosts && hosts.length || 0;
  console.log("hosts.len: ", hosts.length);
  console.log("hostsLen: ", hostsLen);

  if (!hostsLen) {
    res.json({
      err: "File was empty. Please try again."
    });
    return;
  }

  console.log("before each");
  _.each(hosts, function (host) {
    console.log("host: ", host);

    (function (host) {    
    helper.addDaemon({ip: host}, function (data) {
      var err = data.err || false
      errors.push({err: err, ip: host});
      if(!--hostsLen) {
        res.json({data: errors});
        console.log("errors: ", errors);
      } 
    });    
  })(host);

  });
  console.log("after each");

}
module.exports.inject = function(di) {
  logger = di.logger;
  helper = di.helper;
  logger.info("Daemon Management inject");
  return new DaemonManagement(di.config);
}