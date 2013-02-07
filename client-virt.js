
/**
 * Forward Dec 
 **/


var exec = require('child_process').exec;

exports.Virt = Virt;


// Add error checking code 
function Virt () {

}

Virt.prototype.list = function (cb) {
  // Output reference
  console.log("\nListing VMs:\n");

  exec("sudo virsh list --all", function (err, stdout, stderr) {
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
        state:tmp[3] ? tmp[2] + " " + tmp[3] : tmp[2]
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
      state: stderr ? stderr.trim() : stdout.trim()
    });
  })
} // END-FUNCTION

Virt.prototype.status = function (data, cb) {
  console.log("Virt Client - status");
  this.execVirtcmd("sudo virsh domstate " + data.name, cb);
} // END-FUNCTION

Virt.prototype.start = function (data, cb) {
  console.log("Virt Client - start");
  this.execVirtcmd("sudo virsh start " + data.name, cb);
} // END-FUNCTION

Virt.prototype.resume = function (data, cb) {
  console.log("Virt Client - resume");
  this.execVirtcmd("sudo virsh resume " + data.name, cb);
} // END-FUNCTION

Virt.prototype.suspend = function (data, cb) {
  console.log("Virt Client - suspend");
  this.execVirtcmd("sudo virsh suspend " + data.name, cb); 
} // END-FUNCTION

Virt.prototype.shutdown = function (data, cb) {
  console.log("Virt Client - shutdown");
} // END-FUNCTION

Virt.prototype.destroy = function (data, cb) {
  console.log("Virt Client - destroy");
  this.execVirtcmd("sudo virsh destroy " + data.name, cb);
} // END-FUNCTION

