var jade = require('jade');
var express = require('express');
var fs = require('fs');

var app = express.createServer();

app.configure(function(){
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');

  app.use(express.bodyParser());
  app.use(app.router);
});

app.get('/:name?', function(req, res) {
  req.params.name = (req.params.name) ? req.params.name : "Anonymous";
  res.render('index', { layout : true, locals : { name : req.params.name } });
});

app.listen(8080);