
var exec = require('child_process').exec;

var logger;

// Add error checking code 
function Virt (config) {
  console.log("Virt client constructor");
  this.cmdList =  config.virtCmds;
}

Virt.prototype.list = function (cb) {
  // Output reference
  console.log("\nListing VMs:\n");

  exec("virsh list --all", function (err, stdout, stderr) {
    console.log("args; ", arguments);
    // Display output from VIRSH 
    console.log("\nCL Output:");
    console.log("--------------------");

    // Run regex and display matches
    var rawList = stdout.match(/^ [0-9-]+ +[a-zA-Z0-9-]+ +[a-z A-Z]+/mg);
    if (!rawList) {
      // Need to create default error msg
      cb(null, {});
      return;
    }
    var listLength = rawList.length;

    console.log("\nmatches:\n--------------------");
    for (var i = 0; i < listLength; i++) {
      console.log(stdout);
      console.log(rawList[i]);
    }

    // Split each match into 3 & add to JSON array
    var jList = new Array();
    var tmp;

    for (i = 0; i < listLength; i++) {
      tmp = rawList[i].trim().split(/ +/);
      console.log(tmp);

      jList.push({
        id:tmp[0],
        name:tmp[1],
        // Hack - If state is 2 words, will split into 2 elements & 
        //        must be combined:
        status: tmp[3] ? tmp[2] + " " + tmp[3] : tmp[2]
      });
    } 

    // Display confirmation
    console.log("\nkey/value pairs:\n--------------------");
    console.log(jList);

    cb(null, jList);

  }); // END-EXEC
} // END-FUNCTION


Virt.prototype.execVirtcmd = function (cmd, cb) {
  console.log("execVirtcmd");

  exec(cmd, function (err, stdout, stderr) {
    cb(err, {
      stderr: stderr.trim(),
      stdout: stdout.trim()
    });
  })
} // END-FUNCTION



Virt.prototype.actions = function (action, data, cb) {
  logger.info("Virt Client - " + action, {file: __filename, line: __line});
  var cmd = this.cmdList[action] + data.name;
  this.execVirtcmd(cmd, cb);
}

module.exports.inject = function(di) {
  logger = di.logger;
  logger.info("Client Virt inject");
  return new Virt(di.config);
}