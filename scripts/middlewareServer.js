var jade = require('jade');
var express = require('express');
var fs = require('fs');

var DEFAULT_PORT = 8080;

var app = express.createServer();

app.configure(function(){
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');

  app.use(express.bodyParser());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var users = {
    'Sam'   : {
        phone   : '555-123-4567'
      , address : 'Something something st., Montreal, QC'
    }
  , 'James' : {
        phone   : '111-987-6543'
      , address : 'Another something st., Montreal, QC'
  }
  , 'Mike'  : {
        phone   : '955-696-7878'
      , address : 'Something the third st., Montreal, QC'
  }
  , 'Anonymous'  : {
        phone   : '431-159-7532'
      , address : 'Something Jr st., Montreal, QC'
  }
};

function getUserData(req, res, next) {
  var user = users[req.params.name];
  if (user) {
    req.user = user;
    req.user.name = req.params.name;
    next();
  }
  else {
    next(new Error("Can't find the user " + req.params.name));
  }
}

app.get('/', function(req, res) {
  res.render('index', { layout : true, locals : { name: 'anonymous' } });
});

app.get('/entry/:name', getUserData, function(req, res) {
  res.render('entry', { layout : true, locals : req.user });
});

app.listen(DEFAULT_PORT);
console.log("Server started.");
console.log("Listening on port: " + DEFAULT_PORT);