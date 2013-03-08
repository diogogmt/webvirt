
var exec
  , _ 
  , Step
  , logger
  , helper
  , _virt;


// Add error checking code 
function Virt (opt) {
  this.cmdList =  opt.virtCmds;
}

Virt.prototype.listGroup = function (info, cb) {
}

Virt.prototype.listSingle = function (info, cb) {
  var ip = info.ips[0];
  exec("virsh list --all", function (err, stdout, stderr) {
    var err = err || stderr
      , rawList = stdout.match(/^ [0-9-]+ +[a-zA-Z0-9-]+ +[a-z A-Z]+/mg)
      , listLength = (rawList && rawList.length) || 0
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

    cb(err, { instances: list});

  });
}

Virt.prototype.execVirtcmd = function (cmd, cb) {
  exec(cmd, function (err, stdout, stderr) {    
    var error = stderr || err || null;
    if (error) {
      logger.error(err, {file: __filename, line: __line});
      cb(error)
      return;
    }
    cb(null, {data: stdout.replace(new RegExp("\n","gm"),"") || null});
  })
}

Virt.prototype.actions = function (action, data, cb) {
  var cmd = this.cmdList[action] + data.name;
  this.execVirtcmd(cmd, cb);
}

Virt.prototype.hostStats = function (cb) {
  var self = this
    , stats = {}
    , errors = [];

  var standardCommands
    , callbackCounter = standardCommands = 3;
    

  // Individual commands to be run
  var opt = 
    [
      {
        cmd: "virsh nodememstats",
        regex: /\s+\d+/gi,
        keys: ["total", "free", "buffers", "cached"],
        parseValues: function (values) {
          return _.map(values, function (val) {
            return ((val / 1024) / 1024).toFixed(2);
          })
        },
      },
      {
        cmd: "uptime",
        regex: /[0-9]*\.[0-9]+/gi,
        keys: ["load"],
        parseValues: function (values) {

          return [values[2]];
        },
      },
      {
        cmd: "virsh version",
        regex: /\w+\s\d+.\d+.\d+./gi,
        keys: ["library", "api", "hypervisor"],
        parseValues: null
      }
    ];

  // Stat Calls: Standard Logic
  while(standardCommands--) {
    (function (index) {
      var assignData = function (err, result) {

        if (err) {
          console.log("Error: " + err); 
          errors.push(err);
          return;
        }
        console.log("ALL STATS HAHAHA:");
        console.log(stats);
        _.each(opt[index].keys, function (el) {
          stats[el] = result[el]
        });

        ! --callbackCounter && cb(errors, stats);
      };

      self.stats(opt[index], assignData);
    })(standardCommands);  
  }

}

Virt.prototype.stats = function (opt, cb) {
  var cmd = opt.cmd
    , regex = opt.regex
    , keys = opt.keys
    , parseValues = opt.parseValues

  Step([

    function getStats () {
      exec(cmd, this);
    },

    function finish (err, stdout, stderr) {
      var error = err || stderr || null;
      console.log("err: ", err);
      console.log("stderr: ", stderr);
      console.log("stdout: ", stdout);
      if (error) {
        logger.error(err, {file: __filename, line: __line});
        cb(err);
        this.exitChain();
        return;
      }
      var stats = {};
      var values = stdout.match(regex);

      if (parseValues) {
        values = parseValues(values)
      }

      var el = keys.length;
      while (el--) {
        stats[keys[el]] = values[el].trim();
      }

      console.log("stats: ", stats);
      cb(null, stats);
    }
  ], helper.handleStepException("Step error at VirtClient::stats - file: " + __filename + "line: " + __line, cb), false);
};

module.exports.inject = function(di) {
  // Inject dependencies
  exec = di.exec;
  Step = di.Step;
  _ = di._;
  logger = di.logger;
  helper = di.helper;

  if (!_virt) {
    _virt = new Virt({
      virtCmds: di.config.virtCmds
    });
  }
  return _virt;
}