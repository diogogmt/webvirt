

/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , di = {}
  , config
  , logger
  , routes;

// Load dependencies
di.config = config = require('./config.js');
di.logger = logger = require('./logger.js').inject(di);
di.config.type = "client";
routes = require('./routes').inject(di);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 4000);
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

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.get('/', routes.index);

app.get('/list/vms', routes.listSingle);

app.get('/version', routes.version);

app.get('/stats/cpu', routes.cpuStats);
app.get('/stats/mem', routes.memStats);

app.get('/status/:name', routes.actions);
app.get('/start/:name', routes.actions);
app.get('/resume/:name', routes.actions);
app.get('/suspend/:name', routes.actions);
app.get('/shutdown/:name', routes.actions);
app.get('/destroy/:name', routes.actions);
// app.get('/save/:name', routes.save);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



