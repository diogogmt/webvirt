
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

Virt.prototype.status = function (vmName, cb) {
  // Output reference
  console.log("\nListing status of ", vmName, ":\n");

  exec("sudo virsh domstate " + vmName, function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("\nCL Output:");
    console.log("--------------------");
    console.log( stdout.trim() );

    // Check for success and add to JSON object
    var jState = {
      state:stderr ? stderr.trim() : stdout.trim()
    };

    // Display confirmation
    console.log("\nkey/value pairs:\n--------------------");
    console.log(jState);

    cb(null, jState);

  }); // END-EXEC
} // END-FUNCTION

Virt.prototype.start = function (vmName, cb) {
  // Output reference
  console.log("\nStarting ", vmName, ":\n");

  exec("sudo virsh start " + vmName, function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("\nCL Output:");
    console.log("--------------------");
    console.log( stdout.trim() );

    // Check for success and add to JSON object
    var jState = {
      response:stderr ? stderr.trim() : stdout.trim()
    };

    // "Display" confirmation
    console.log("\nkey/value pairs:\n--------------------");
    console.log(jState);

    cb(null, jState);

  }); // END-EXEC
} // END-FUNCTION

Virt.prototype.resume = function (vmName, cb) {
  // Output reference
  console.log("Resuming ", vmName, ":");

  exec("sudo virsh resume " + vmName, function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("CL Output:");
    console.log("--------------------");
    console.log(stdout);

    // Check for success and add to JSON object
    var jState = {
      response:stderr ? stderr : stdout
    };

    // Display confirmation
    console.log("key/value pairs:\n--------------------");
    console.log(jState);

    cb(null, jState);

  }); // END-EXEC
} // END-FUNCTION

Virt.prototype.suspend = function (vmName, cb) {
  // Output reference
  console.log("Suspending ", vmName, ":");

  exec("sudo virsh suspend " + vmName, function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("CL Output:");
    console.log("--------------------");
    console.log(stdout);

    // Check for success and add to JSON object
    var jState = {
      response:stderr ? stderr : stdout
    };

    // Display confirmation
    console.log("key/value pairs:\n--------------------");
    console.log(jState);

    cb(null, jState);

  }); // END-EXEC
} // END-FUNCTION

Virt.prototype.shutdown = function (vmName, cb) {
  // Output reference
  console.log("Shutting down ", vmName, ":");

  exec("sudo virsh shutdown " + vmName, function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("CL Output:");
    console.log("--------------------");
    console.log(stdout);

    // Check for success and add to JSON object
    var jState = {
      response:stderr ? stderr : stdout
    };

    // Display confirmation
    console.log("key/value pairs:\n--------------------");
    console.log(jState);

    cb(null, jState);

  }); // END-EXEC
} // END-FUNCTION

Virt.prototype.destroy = function (vmName, cb) {
  // Output reference
  console.log("Destroying ", vmName, ":");

  exec("sudo virsh destroy " + vmName, function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("\nCL Output:");
    console.log("--------------------");
    console.log(stdout);

    // Check for success and add to JSON object
    var jState = {
      response:stderr ? stderr : stdout
    };

    // Display confirmation
    console.log("\nkey/value pairs:\n--------------------");
    console.log(jState);

    cb(null, jState);

  }); // END-EXEC
} // END-FUNCTION


Virt.prototype.save = function(vmName, cb) {
  // Output reference
  console.log("Saving ", vmName, ":");

  exec("sudo virsh save "
        + vmName + " " 
        + vmName + ".sfile"
        , function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("CL Output:");
    console.log("--------------------");
    console.log(stdout);

    // Check for success and add to JSON object
    var jState = {
      response:stderr ? stderr : stdout
    };

    // Display confirmation
    console.log("key/value pairs:\n--------------------");
    console.log(jState);

    cb(null, jState);
    
  }); // END-EXEC
} // END-FUNCTION

