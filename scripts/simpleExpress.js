var express = require('express');
var fs = require('fs');

var app = express.createServer();

app.get('/', function(req, res){
    var data = fs.readFileSync('page.html', 'utf-8');
    res.send(data);
});

app.listen(8080);
