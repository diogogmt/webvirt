

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

app.configure(function () {
  app.set('port', config.interfaceServerPort);
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

app.get('/', routes.actions);

// Virt API
app.get('/list/vms', routes.list);
app.get('/list/daemons', routes.listDaemons);
app.get('/status/:ip/:name', routes.actions);
app.get('/start/:ip/:name', routes.actions);
app.get('/resume/:ip/:name', routes.actions);
app.get('/suspend/:ip/:name', routes.actions);
app.get('/shutdown/:ip/:name', routes.actions);
app.get('/destroy/:ip/:name', routes.actions);
// app.get('/save/:name', routes.save);


// Network Scanner API
app.get("/daemonScan", crawler.daemonScan);
app.get("/networkScan", crawler.networkScan);

http.createServer(app).listen(app.get('port'), function(){
  logger.info("Express server listening on port " + app.get('port'));
});



