
var exec = require('child_process').exec
  , _ = require('underscore')
  , Step = require('step')
  , logger;


// Add error checking code 
function Virt (config) {
  console.log("Virt client constructor");
  this.cmdList =  config.virtCmds;
}

Virt.prototype.listGroup = function (info, cb) {
}

Virt.prototype.listSingle = function (info, cb) {
  exec("virsh list --all", function (err, stdout, stderr) {
    var err = err || stderr
      , rawList = stdout.match(/^ [0-9-]+ +[a-zA-Z0-9-]+ +[a-z A-Z]+/mg)
      , listLength = (rawList && rawList.length) || 0
      , list = []
      , tmp;

    for (i = 0; i < listLength; i++) {
      tmp = rawList[i].trim().split(/ +/);
      list.push({
        id:tmp[0],
        name:tmp[1],
        status: tmp[3] ? tmp[2] + " " + tmp[3] : tmp[2]
      });
    } 

    cb({err: err, data: list});

  });
}


Virt.prototype.execVirtcmd = function (cmd, cb) {
  console.log("execVirtcmd");
  console.log("cmd: ", cmd);
  exec(cmd, function (err, stdout, stderr) {    
    var error = err || stderr || null;
    if (error) {
      logger.error(err, {file: __filename, line: __line});
    }
    cb({err: error, data: stdout || null});
  })
} // END-FUNCTION


Virt.prototype.actions = function (action, data, cb) {
  logger.info("Virt Client - actins: " + action, {file: __filename, line: __line});
  var cmd = this.cmdList[action] + data.name;
  this.execVirtcmd(cmd, cb);
}

Virt.prototype.version = function (data, cb) {
  logger.info("Virt Client - version", {file: __filename, line: __line});

  var sendResponse = function (err) {
    logger.error(err, {file: __filename, line: __line});
    cb(err, null);
  };

  Step([
    function getVersion () {
      logger.info("getVersion", {file: __filename, line: __line});
      exec("virsh version", this);
    },

    function finish (err, stdout, stderr) {
      logger.info("finish", {file: __filename, line: __line});

      var error = err || stderr || null;
      if (error) {
        logger.error(err, {file: __filename, line: __line});
      }

      var version = {};
      var values = stdout.match(/\w+\s\d+.\d+.\d+./gi);
      var keys = ["library", "api", "hypervisor"];
      var length = keys.length;
      while (length--) {
        version[keys[length]] = values[length].trim();
      }
      console.log("version: ", version);
      cb({err: error, data: version});
    }
  ], sendResponse, false);

};

Virt.prototype.listDaemonDetails = function (data, cb) {
  logger.info("Virt Client - daemonDetails", {file: __filename, line: __line});

  var details = {
    version: {},
    cpuStats: {},
    memStats: {}
  };
  
  var sendResponse = function (err) {
    logger.error(err, {file: __filename, line: __line});
    cb(err, null);
  };

  Step([
    function getVersion () {
      logger.info("getVersion", {file: __filename, line: __line});
      exec("virsh version", this);
    },

    function getCpuStats (err, stdout, stderr) {
      logger.info("getCpuStats", {file: __filename, line: __line});
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        sendResponse(err, null);
        this.exitChain();
        return;
      }

      var values = stdout.match(/\w+\s\d+.\d+.\d+./gi);
      values.push(stdout, stderr);
      var keys = ["library", "api", "hypervisor", "stdout", "stderr"];
      var length = keys.length;
      while (length--) {
        details.version[keys[length]] = values[length].trim();
      }

      exec("virsh nodecpustats --percent", this);
    },

    function getMemStats (err, stdout, stderr) {
      logger.info("getMemStats", {file: __filename, line: __line});
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        sendResponse(err, null);
        this.exitChain();
        return;
      }

      var values = stdout.match(/\s+[0-9.]+/gi);

      values.push(stdout, stderr);
      var keys = ["usage", "user", "system", "idle", "iowait", "stdout", "stderr"];
      var length = keys.length;
      while (length--) {
        details.cpuStats[keys[length]] = values[length].trim();
      }

      exec("virsh nodememstats", this);
    },

    function finish (err, stdout, stderr) {
      logger.info("getMemStats", {file: __filename, line: __line});
      if (err) {
        logger.error(err, {file: __filename, line: __line});
        sendResponse(err, null);
        this.exitChain();
        return;
      }

      var values = stdout.match(/\s+\d+/gi);
      console.log("values: ", values);
      values = _.map(values, function (val) {
        console.log("val: ", val);
        return ((val / 1024) / 1024).toFixed(2);
      })
      console.log("values: ", values);
      
      values.push(stdout, stderr);
      var keys = ["total", "free", "buffers", "cached", "stdout", "stderr"];
      var length = keys.length;
      while (length--) {
        details.memStats[keys[length]] = values[length];
      }

      cb(null, details);
    }
  ], sendResponse, false);
}

module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("Client Virt inject");
  return new Virt(di.config);
}