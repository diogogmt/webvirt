
/**
 * Forward Dec 
 **/

var list = function(req, res) {
  // Output reference
  console.log("\nListing VMs:\n");
  res.end();

  exec("virsh list --all", function(err, stdout, stderr){
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
  }); // END-EXEC
} // END-FUNCTION

var status = function(req, res) {
  // Output reference
  console.log("\nListing status of " + req.params["name"] +":\n");
  res.end();

  exec("virsh domstate " + req.params["name"], function(err, stdout, stderr) {
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
  }); // END-EXEC
} // END-FUNCTION

var start = function(req, res) {
  // Output reference
  console.log("\nStarting " + req.params["name"] +":\n");
  res.end();

  exec("virsh start " + req.params["name"], function(err, stdout, stderr) {
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
  }); // END-EXEC
} // END-FUNCTION

var resume = function(req, res) {
  // Output reference
  console.log("Resuming "  + req.params["name"] +":");
  res.end();

  exec("virsh resume " + req.params["name"], function(err, stdout, stderr) {
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
  }); // END-EXEC
} // END-FUNCTION

var suspend = function(req, res) {
  // Output reference
  console.log("Suspending " + req.params["name"] +":");
  res.end();

  exec("virsh suspend " + req.params["name"], function(err, stdout, stderr) {
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
  }); // END-EXEC
} // END-FUNCTION

var shutdown = function(req, res) {
  // Output reference
  console.log("Shutting down " + req.params["name"] +":");
  res.end();

  exec("virsh shutdown " + req.params["name"], function(err, stdout, stderr) {
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
  }); // END-EXEC
} // END-FUNCTION

var destroy = function(req, res) {
  // Output reference
  console.log("Destroying " + req.params["name"] +":");
  res.end();

  exec("virsh destroy " + req.params["name"], function(err, stdout, stderr) {
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
  }); // END-EXEC
} // END-FUNCTION


/*var save = function(req, res) {
  // Output reference
  console.log("Saving " + req.params["name"] +":");
  res.end();

  exec(   "virsh save "
        + req.params["name"] + " " 
        + req.params["name"] + ".sfile"
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
  }); // END-EXEC
} // END-FUNCTION
*/

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , exec = require('child_process').exec;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

/**
 * Queries
 **/

app.get('/list', list);
app.get('/status/:name', status);
app.get('/start/:name', start);
app.get('/resume/:name', resume);
app.get('/suspend/:name', suspend);
//app.get('/save/:name', save);
app.get('/shutdown/:name', shutdown);
app.get('/destroy/:name', destroy);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



