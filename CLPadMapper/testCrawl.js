var request = require('request');
var jsdom = require('jsdom');
var fs = require('fs');

var baseURL = "http://where.yahooapis.com/geocode?appid=dj0yJmk9ZzFWN2ZEUVNNd0xtJmQ9WVdrOVVVTm5TVVZITkRRbWNHbzlNVEkwT1RZeU5UTTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hMw--&flags=CJ";
var address = "&q=701+First+Ave.,+Sunnyvale,+CA+94089";
request({ uri: baseURL + address
        , method: 'GET'
        , headers : { "accept-charset": "utf-8"}
        , encoding : 'binary'
        }
  , function (error, response, body) {
      if (error || response.statusCode !== 200)
        throw new Error('request(): ' + JSON.stringify(error));

      // console.log(body.toString('utf8'))
      //We're converting the raw binary data to utf8.
      var htmlData = new Buffer(body, 'binary').toString('utf8');
      var data = JSON.parse(htmlData).ResultSet.Results[0];
      console.log(data.latitude + " " + data.longitude);
  }
);