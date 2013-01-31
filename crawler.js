
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , net = require('net')
  , exec = require('child_process').exec
  , Step = require('step')
  , redis = require("redis");

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



// Redis
client = redis.createClient(6379, '127.0.0.1')

client.on("error", function (err) {
    console.log("Error " + err);
});



// client.set("string key", "string val", console.log);
// client.hset("hash", "hashtest 1", "some value", console.log);
// client.hset(["hash key", "hashtest 2", "some other value"], console.log);
// client.hkeys("hash key", function (err, replies) {
//     console.log(replies.length + " replies:");
//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });

//     // Set a value
//     client.set("string key", "Hello World", redis.print);
//     // Get the value back
//     client.get("string key", function (err, reply) {
//         console.log(reply.toString());
//     });
//     client.quit();
// });


// client.incr("counter", function (err, counter) {
//   // multi chain with an individual callback
//   client.multi()
//     .hset("hosts:"+counter, "ip", "10.0.0.0")
//     .hset("hosts:"+counter, "status", "on")
//     .hset("hosts:"+counter, "type", "compute")
//     .hset("hosts:"+counter, "lastOn", "timestamp")
//     .exec(function (err, replies) {
//         console.log("MULTI got " + replies.length + " replies");
//         replies.forEach(function (reply, index) {
//             console.log("Reply " + index + ": " + reply.toString());
//         });
//     });

// });
var networkRegex = /10\.0\.0\.[0-9]*/g;



// Scan network for online hosts
// Returns error, stdout and stderr
var searchNetwork = function (cb) {
  console.log("serchNetwork");
  exec("sudo nmap -sP  --version-light --open --privileged 10.0.0.0/24", cb);
}

// Save online hosts
var saveOnlineHosts = function (hosts, cb) {
  console.log("\n\n\nsaveOnlineHosts");
  console.log("args: ", arguments);
  console.log("haha");
  // var hosts_up = stdout.match(networkRegex);
  console.log("hosts: ", hosts);
  console.log("hehe");

  // Save online hosts on redis
  Step(
    function incrementCounter () {
      console.log("incrementCounter");
      client.incr("counter", this);
    },

    function saveHost (err, counter) {
      console.log("saveHost");
      console.log("counter");
      client.hset("hosts:type", counter, "on");
      client.hset("hosts:type", "18", "off");
      client.multi()
        .hset("hosts:"+counter, "ip", "10.0.0.0")
        .hset("hosts:"+counter, "status", "on")
        .hset("hosts:"+counter, "type", "compute")
        .hset("hosts:"+counter, "lastOn", "timestamp")
        .hset("hosts:type", counter, "on")
        .exec(function (err, replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });
            cb();
        });
    }
  );
};


// Scan online hosts for compute nodes
var searchHosts = function (cb) {
  console.log("searchHosts")
  // Get hosts list from redis
  var hosts = new Array();
  exec("sudo nmap --version-light --open --privileged -p 80 " + hosts.join(" ") + "", cb);
};


// Save compute nodes
var saveComputeNodes = function (computeNodes) {
  var regex = /10\.0\.0\.[0-9]*/g;
  computeNodes = computeNodes.match(networkRegex);
  console.log("compute_nodes: ", compute_nodes);

  // Save compute nodes on redis
}

// Check if compute nodes are still online
var checkComputeCodes = function () {}




// Crawler
var child;

console.log("before step");
// find hosts that are up
Step(
  function findHostsStep () {
    console.log("find hosts");
    // searchNetwork(this);
    this.next();
  },

  function findComputeNodesStep (error, stdout, stderr) {
    console.log("findComputeNodes");
    // console.log("stdout: ", stdout);
    var that = this;
    saveOnlineHosts(stdout, function () {
      console.log("saveOnlineHosts callback");
      searchHosts(that);
    });
    // console.log("calling saveOnlineHosts");
    // saveOnlineHosts(stdout, this);
    // console.log("after calling saveOnlineHosts");
  },

  function saveComputeNodesStep (error, stdout, stderr) {
    console.log("\n\n\nsaveComputeNodes");
    console.log("arguments: ", arguments);

    // saveComputeNodes(stdout);
    
  }
);
console.log("after step");


// exit;

// console.log("creating server...");

// var server = net.createServer(function (socket) {

//   socket.on("connect", function () {
//     var str = "conn established";
//     socket.write(str);
//   });

//   socket.on("data", function (req) {
//     console.log("server on data");
//     var data = req.toString();

//     try {
//       json = JSON.parse(data);
//       console.log(json);
//       if (!json && (!json.action || !json.ip_addr)) {
//         // Bad format
//         // Emitt error
//         console.log("msg corrupted");
//         return;
//       }

//       switch (json.action) {
//         case "conn":
//           console.log("machine " + json.ip_addr + " registering with the server.");
//         break;
//         default:
//          console.log("default action");
//       }

//     } catch (err) {
//        console.log("JSON parse error:" + err);
//     } 
//   });
// });



// // grab a random port.
// server.listen(8080, function () {
//   address = server.address();
//   console.log("opened server on %j", address);
// });



  

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
