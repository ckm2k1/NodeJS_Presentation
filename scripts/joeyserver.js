var fs = require('fs');
var http = require('http');

http.createServer(function (req, res) {
  var data = "Some string of data with an exlamation point!"
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(data + '\n');
}).listen(8080, 'localhost');
console.log('Server running at http://localhost:8080/');