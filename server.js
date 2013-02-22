

/**
 * Module dependencies.
 */


var express = require('express')
  , crawler = require('./routes/crawler-routes.js')
  , http = require('http')
  , path = require('path')
  , di = {}
  , config
  , logger
  , routes;




// Load dependencies
di.config = config = require('./config.js');
di.logger = logger = require('./logger.js').inject(di);
di.config.type = "server";
routes = require('./routes').inject(di);

logger.info("config: ", config);  

var app = express();

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  // console.log("allowCrossDomain");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  next();
}



app.configure(function () {
  app.set('port', config.interfaceServerPort);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { pretty: true });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('test'));
  app.use(express.session());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// Set JADE to "pretty"
app.locals.pretty = true;

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/test', function (req, res) {
  console.log("test");
  console.log("req.headers: ", req.headers);
  console.log("req.session: ", req.session);
  if (!req.session.auth) {
    req.session.auth = true;
  }
  
  res.json({test: "test"});
});


// UI 
app.get('/', crawler.dashboard);
app.get('/dashboard', crawler.dashboard);

// Virt API
app.get('/list/vms', routes.listGroup);
app.get('/list/vms/:ip', routes.listSingle);
app.get('/list/daemons', routes.listDaemons);

app.get('/stats/version/:ip', routes.version);
app.get('/stats/cpu/:ip', routes.cpuStats);
app.get('/stats/mem/:ip', routes.memStats);

app.get('/status/:ip/:name', routes.actions);
app.get('/start/:ip/:name', routes.actions);
app.get('/resume/:ip/:name', routes.actions);
app.get('/suspend/:ip/:name', routes.actions);
app.get('/shutdown/:ip/:name', routes.actions);
app.get('/destroy/:ip/:name', routes.actions);
// app.get('/save/:name', routes.save);


// Network Scanner API
app.get("/scan/network", crawler.networkScan);
app.get("/scan/daemons", crawler.daemonScan);



var client = require("./db-conn").client;

var Step = require('step');


var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');


app.get('/user/login', function (req, res) {
  console.log("login route");

  res.render('login', {});
});

app.get('/user/create', function (req, res) {
  console.log("login route");

  res.render('create-user', {});
});




app.post('/user/create', function (req, res) {
  console.log("route /createUser");
  var username = req.body['username'];
  var password = req.body['password'];
  console.log("username: ", username);
  console.log("password: ", password);
  
  var hashKey = "users:" + username;

  Step([
    function checkUsername () {
      console.log("Step checkUsername");
      client.hlen(hashKey, this);
    },

    function createUser (err, len) {
      console.log("Step createUser");
      console.log("err: ", err);
      console.log("len: ", len);

      var step = this;

      if (len) {
        this.exitChain();
        return;
      }

      var salt = bcrypt.genSalt(100, function (err, salt) {
        console.log("salt: ", salt);
        // var shasum = crypto.createHash('sha512');
        // var newHash = shasum.update(hash).digest("hex");
        var scrypt = require("scrypt");
        var maxtime = 0.1;
        var maxmem = 0, maxmemfrac = 0.5;

        var saltLength = salt.length;
        var saltedPass = salt.slice(0,saltLength / 2) + password + salt.slice(saltLength / 2, saltLength);
        console.log("saltLength: ", saltLength); 
        console.log("saltedPass: ", saltedPass); 

        scrypt.passwordHash(saltedPass, maxtime, maxmem, maxmemfrac, function(err, scryptHash) {
          console.log("err: ", err);
          console.log("scryptHash: ", scryptHash);
          client.multi()
            .hset(hashKey, "password", scryptHash)
            .hset(hashKey, "salt", salt)
            .exec(step);

    });
      });

    },

    function confirmCreation (err, status) {
      console.log("confirmCreation");
      console.log("args: ", arguments);
      console.log("err: ", err);
      console.log("status: ", status);

      res.json({
        err: err,
        status: status
      });
    }

  ]);

  
});

app.post('/user/auth', function (req, res) {
  console.log("route /auth");
  var username = req.body.username;
  var password = req.body.password;
  console.log("req.body: ", req.body);
  console.log("username: ", username);
  console.log("password: ", password);

  var hashKey = "users:" + username;

  Step([
    function getUserInfo () {
      console.log("Step checkUsername");
      var step = this;
      // client.multi()
      //   .hmget(hashKey, "salt")
      //   .hmget(hashKey, "password")
      //   .exec(step);
      client.hgetall(hashKey, this);
    },

    function authsUser (err, data) {
      console.log("Step createUser");
      console.log("args: ", arguments);
      var salt = data.salt;
      var savedPassword = data.password;
      console.log("err: ", err);
      console.log("salt: ", salt);
      console.log("savedPassword: ", savedPassword);
      console.log("password: ", password);

      var step = this;

      if (err || !salt || ! password) {
        this.exitChain();
        return;
      }

      var scrypt = require("scrypt");
      var maxtime = 0.1;
      var maxmem = 0, maxmemfrac = 0.5;

      var saltLength = salt.length;
      var saltedPass = salt.slice(0,saltLength / 2) + password + salt.slice(saltLength / 2, saltLength);
      console.log("saltLength: ", saltLength); 
      console.log("saltedPass: ", saltedPass); 

      scrypt.verifyHash(savedPassword, saltedPass, this); 

    },

    function checkResults (err, result) {
      console.log("err: ", err);
      console.log("result: ", result);
      res.json({
        err: err,
        result: result
      });
    }

  ]);
  

  // var scrypt = require("scrypt");
  // var maxtime = 0.1;
  // var maxmem = 0, maxmemfrac = 0.5;



  // var pass = "abc";
  // scrypt.passwordHash(pass, maxtime, maxmem, maxmemfrac, function(err, scryptHash) {
  //   console.log("err: ", err);
  //   console.log("scryptHash: ", scryptHash);

  //   scrypt.verifyHash(scryptHash, pass, function(err, result) {
  //     console.log("err: ", err);
  //     console.log("result: ", result);
  //   });
  // });

  // scrypt.passwordHash(pass, maxtime, maxmem, maxmemfrac, function(err, scryptHash) {
  //   console.log("err: ", err);
  //   console.log("scryptHash: ", scryptHash);
  
  //   scrypt.verifyHash(scryptHash, pass, function(err, result) {
  //     console.log("err: ", err);
  //     console.log("result: ", result);
  //   });
  // });

  // scrypt.passwordHash(pass, maxtime, maxmem, maxmemfrac, function(err, scryptHash) {
  //   console.log("err: ", err);
  //   console.log("scryptHash: ", scryptHash);
  //   scrypt.passwordHash(pass, maxtime, maxmem, maxmemfrac, function(err, newHash) {
  //     console.log("err: ", err);
  //     console.log("newHash: ", newHash);
  //     if (scryptHash === newHash) {
  //         console.log("PASSWORDS MATCH!");
  //       } else {
  //         console.log("PASSWORDS DO NOT MATCH!");
  //       }
  //   });
  // });


  // res.json(null);

});


http.createServer(app).listen(app.get('port'), function(){
  logger.info("Express server listening on port " + app.get('port'));
});



