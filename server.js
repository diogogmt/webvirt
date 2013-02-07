

/**
 * Module dependencies.
 */


var express = require('express')
  , crawler = require('./routes/crawler-routes.js')
  , http = require('http')
  , path = require('path');

var di = {};
di.config = config = require('./config.js');
di.config.type = "server";
var routes = require('./routes').inject(di);

console.log("config: ", config);  

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
app.get('/list', routes.list);
app.get('/status/:ip/:name', routes.actions);
app.get('/start/:ip/:name', routes.actions);
app.get('/resume/:ip/:name', routes.actions);
app.get('/suspend/:ip/:name', routes.actions);
app.get('/shutdown/:ip/:name', routes.actions);
app.get('/destroy/:ip/:name', routes.actions);
// app.get('/save/:name', routes.save);


// Network Scanner API
app.get("/daemonScann", crawler.daemonScann);
app.get("/networkScann", crawler.networkScann);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



