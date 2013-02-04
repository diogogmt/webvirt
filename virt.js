
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
  // res.end();

  exec("virsh list --all", function(err, stdout, stderr) {
    // Display output from VIRSH 
    console.log("\nCL Output:");
    console.log("--------------------");

    // Run regex and display matches
    var rawList = stdout.match(/^ [0-9-]+ +[a-zA-Z0-9-]+ +[a-z A-Z]+/mg);
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

  exec("virsh domstate " + vmName, function(err, stdout, stderr) {
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

  exec("virsh start " + vmName, function(err, stdout, stderr) {
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

  exec("virsh resume " + vmName, function(err, stdout, stderr) {
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

  exec("virsh suspend " + vmName, function(err, stdout, stderr) {
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

  exec("virsh shutdown " + vmName, function(err, stdout, stderr) {
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

  exec("virsh destroy " + vmName, function(err, stdout, stderr) {
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

  exec("virsh save "
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

