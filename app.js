

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')

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
app.get('/list', routes.list);
app.get('/status/:name', routes.status);
app.get('/start/:name', routes.start);
app.get('/resume/:name', routes.resume);
app.get('/suspend/:name', routes.suspend);
app.get('/shutdown/:name', routes.shutdown);
app.get('/destroy/:name', routes.destroy);
app.get('/save/:name', routes.save);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});



