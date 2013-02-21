

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
  , routes = {};




// Load dependencies
di.config = config = require('./config.js');
di.logger = logger = require('./logger.js').inject(di);
di.config.type = "server";

routes.virt = require('./routes').inject(di);
routes.userManagement = require('./routes/user-management.js').inject(di);

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


// Virt API
app.get('/list/vms', routes.virt.listGroup);
app.get('/list/vms/:ip', routes.virt.listSingle);
app.get('/list/daemons', routes.virt.listDaemons);

app.get('/stats/version/:ip', routes.virt.version);
app.get('/stats/cpu/:ip', routes.virt.cpuStats);
app.get('/stats/mem/:ip', routes.virt.memStats);

app.get('/status/:ip/:name', routes.virt.actions);
app.get('/start/:ip/:name', routes.virt.actions);
app.get('/resume/:ip/:name', routes.virt.actions);
app.get('/suspend/:ip/:name', routes.virt.actions);
app.get('/shutdown/:ip/:name', routes.virt.actions);
app.get('/destroy/:ip/:name', routes.virt.actions);


// Network Scanner API
app.get("/scan/network", crawler.networkScan);
app.get("/scan/daemons", crawler.daemonScan);


// User Management
app.get('/user/login', routes.userManagement.loginGet);
app.get('/user/create', routes.userManagement.createGet);
app.get('/user/changePassword', routes.userManagement.changePasswordGet);


app.post('/user/changePassword', routes.userManagement.changePassword);
app.post('/user/create', routes.userManagement.create);
app.post('/user/auth', routes.userManagement.auth);


http.createServer(app).listen(app.get('port'), function(){
  logger.info("Express server listening on port " + app.get('port'));
});



