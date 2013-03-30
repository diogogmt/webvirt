
var exec
  , _ 
  , Step
  , logger = {}
  , helper = {}
  , _virt;


helper.handleStepException = function (msg, cb) {
  return function (fnName, err) {
    cb(err + " at " + fnName + " - " + msg);    
  }
}

// Add error checking code 
function VirtModel (opt) {
  this.cmdList =  opt.virtCmds;
}

VirtModel.prototype.actions = function (options, cb) {
  options = options || {};
  var cmd = this.cmdList[options.action] + options.name;
  this.execVirtcmd(cmd, cb);
}

VirtModel.prototype.execVirtcmd = function (cmd, cb) {
  exec(cmd, function (err, stdout, stderr) {    
    var error = stderr || err;
    stdout = stdout || "";
    // Sometimes virsh returns multiples errors.
    // We need to parse and combine them into a single one
    if (error) {
      error = error.replace(/(\r\n|\n|\r)/gm,"").trim();
      error = error.split("error:").filter(function (el) {
        return el.length != 0;
      });
      var errorLen = error.length;
      // If the error didn't have an error key
      // We use the original error msg
      if (!errorLen) {
        errorLen = 1;
        error[0] = error;
      }
      var i;
      var combinedError = "";
      for (i = 0; i < errorLen; i++) {
        combinedError += error[i] + " - ";
      }
      error = combinedError;
    }
    // TODO: send back a string instead of an object
    // UI is breaking if the format changes
    // cb(error, stdout.replace(new RegExp("\n","gm"),"") || null);
    cb(error, {
      data: stdout.replace(new RegExp("\n","gm"),"") || null
    });
  })
}

VirtModel.prototype.hostStats = function (cb) {
  console.log("VirtModel - hostStats");
  var self = this
    , stats = {}
    , errors = [];

  var standardCommands
    , callbackCounter = standardCommands = 3;
    
  // Individual commands to be run
  var opt = [
    {
      cmd: "virsh nodememstats",
      regex: /\s+\d+/gi,
      keys: ["memUsed", "memFree"],
      parseValues: function (values) {
        values = {
          memTotal: values[0],
          memFree : values[1],
          buffers : values[2],
          cached  : values[3]
        };
        var newValues = {
          memUsed : values.memTotal - values.memFree,
          memFree : values.memFree
        };
        return _.map(newValues, function (val) {
          return ((val / 1024) / 1024).toFixed(2);
        });
      },
    },

    {
      cmd: "uptime",
      regex: /[0-9]*[.,][0-9]+/gi,
      keys: ["load"],
      parseValues: function (values) {
        var largest = parseFloat(values[0]) >= parseFloat(values[1]) ? values[0] : values[1];
        largest = parseFloat(largest) >= parseFloat(values[2]) ? largest : values[2];
        return [largest];
      },
    },

    {
      cmd: "virsh version",
      regex: /\w+\s\d+\.\d+\.\d+/gi,
      keys: ["hypervisor"],
      parseValues: function (values) {
        console.log("virsh version parseValues callback");
        console.log("values: ", values);
        return [values[2]];
      }
    }
  ];

  // Stat Calls: Standard Logic
  while(standardCommands--) {
    (function (index) {
      var assignData = function (err, result) {
        console.log("assignData");
        console.log("err: ", err);
        console.log("result: ", result);
        if (err) {
          errors.push(err);
          --callbackCounter;
          console.log("returining...");
          return;
        }
        _.each(opt[index].keys, function (el) {
          stats[el] = result[el]
        });

        console.log("****callbackCounter: ", callbackCounter);
        // Javascript Ninja alert!
        ! --callbackCounter && cb(errors, stats);
      };
      self.stats(opt[index], assignData);
    })(standardCommands);  
  }
}

VirtModel.prototype.list = function (options, cb) {
  options = options || {};
  var ip = options.ip;
  exec("virsh list --all", function (err, stdout, stderr) {
    var error = err || stderr
      , rawList = stdout.match(/^ +[0-9-]+ +[a-zA-Z0-9-]+ +[a-z A-Z]+/mg)
      , listLength = rawList && rawList.length || 0
      , list = []
      , tmp;

    for (i = 0; i < listLength; i++) {
      tmp = rawList[i].trim().split(/ +/);
      list.push({
        vid:tmp[0],
        id:tmp[1],
        status: tmp[3] ? tmp[2] + " " + tmp[3] : tmp[2],
        ip: ip
      });
    } 
    cb(error, {instances: list});
  });
}

VirtModel.prototype.stats = function (opt, cb) {
  console.log("VirtModel - stats");
  var cmd = opt.cmd
    , regex = opt.regex
    , keys = opt.keys
    , parseValues = opt.parseValues

    console.log("---cmd: ", cmd);

  Step([
    function getStats () {
      exec(cmd, this);
    },

    function finish (err, stdout, stderr) {
      console.log("----finish: ", cmd);
      var error = err || stderr;
      if (error) {
        cb(error);
        this.exitChain();
        return;
      }

      if (!stdout) {
        cb("No response back from: " + cmd);
        this.exitChain();
        return; 
      }

      var stats = {};
      var values = stdout.match(regex);

      if (!values || !values.length) {
        console.log("stdout: ", stdout);
        console.log("regex: ", regex);
        console.log("values: ", values);
        cb("Regex didn't work for command:  " + cmd);
        this.exitChain();
        return; 
      }

      if (parseValues) {
        values = parseValues(values)
      }

      if (!values || !values.length) {
        cb("Parsing logic didn't work for command:  " + cmd);
        this.exitChain();
        return; 
      }

      console.log("---cmd: ", cmd, " - parseValues: ", parseValues)
      var el = keys && keys.length || 0;
      while (el--) {
        stats[keys[el]] = values[el] && values[el].trim();
      }
      console.log("Step finish - firing callback: ", stats);
      cb(null, stats);
    }
  ], helper.handleStepException("Step error at VirtModel::stats - file: " + __filename + "line: " + __line, cb), false);
};

module.exports.inject = function(di) {
  // Inject dependencies
  exec = di.exec;
  Step = di.Step;
  _ = di._;

  if (!_virt) {
    _virt = new VirtModel({
      virtCmds: di.config.virtCmds
    });
  }
  return _virt;
}