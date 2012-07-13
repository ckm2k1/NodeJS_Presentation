var url = require("url");
var Crawler = require('./crawler.js').Crawler;
var request = require('request');
var fs = require('fs');

//Some config
var cacheFileName = 'coordCache.ex'
, ccfHandle = fs.openSync(cacheFileName, "w", 0666)
, baseURL = "http://montreal.en.craigslist.ca/apa/"
, coordsCacheArray = []
//This is used to keep track of wether we're finished
//geocoding everything in the queue.
, geocoded = 0
, pages = 0;

function writeCoordCache() {

  var str = "var coordCache = ";
  str     += JSON.stringify(coordsCacheArray);
  str     += ";\n";

  console.log('started writing');
  fs.writeSync(ccfHandle, str);
  console.log('finished writing');
  fs.close(ccfHandle);
}

//Geocoder function
function geoCode(clPost) {
  //geocoding API url + dev key
  var base = "http://where.yahooapis.com/geocode?appid=dj0yJmk9ZzFWN2ZEUVNNd0xtJmQ9WVdrOVVVTm5TVVZITkRRbWNHbzlNVEkwT1RZeU5UTTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hMw--&flags=CJ&q=";
  var queryURL = base + clPost.gqAddress;

  request({uri: queryURL, method: 'GET'}, function (error, response, body) {

    var response  = JSON.parse(body)
    , results     = response.ResultSet.Results;

    if (typeof results !== "undefined" && results !== null) {
      var results = results[0]
      , coords = { lat : results.latitude
                 , lng : results.longitude
                 };

      clPost.coords = coords;
      coordsCacheArray.push(clPost);

    }
    else {
      console.log("Geocoding failed!");
      console.log(error);
    }

    checkState();
    console.log(geocoded + ": " + clPost.clURL);
  });

}

function checkState() {
    geocoded--;
    console.log("Geocoded: " + geocoded);
    if (!geocoded) {
      pages--;
      console.log("Pages: " + pages);
      if (!pages) writeCoordCache();
    }
}


var getAddress = function getGmapAddress() {
  var $         = this.jQuery
  , addressLink = $("small > a").attr("href")
  , postTitle   = $("h2").text()
  , postBody    = $("#userbody").html()
  , qAddress    = ""
  , clPostID    = $("span.postingidtext").text().split(":")[1].trim()
  , clPostObj   = { };

  if (typeof addressLink !== 'undefined' && addressLink !== null) {
    //"http://maps.googleapis.com/maps/api/geocode/json?address="
    //Use url.parse to extract the query portion of the url and split based on loc argument.
    //We're not decoding the url here because we will use it shortly for geocoding
    //the address.
    qAddress = url.parse(addressLink, true).search.split('loc%3A+')[1];

    clPostObj.title     = postTitle;
    clPostObj.body      = postBody;
    clPostObj.clURL     = baseURL + clPostID + ".html";
    clPostObj.gqAddress = qAddress;

    geoCode(clPostObj);
  }
  else {
    checkState();
    console.log('address link not found');
    return;
  }
}

var pageCrawler = new Crawler({ callback: getAddress });
var clCrawler = new Crawler({

  callback: function () {

    if (clCrawler.iterNum > 0) {
      var $ = this.jQuery
        , paras = $("p")
        , links = []
        , linkText

      console.log("Gathering links to crawl.\n");
      $.each(paras, function (index, value) {
        var pLink = $(value).children("a");
        if (pLink.length !== 0) {
          linkText = pLink.attr("href");
          links.push(linkText);
        }
      });

      console.log("Crawling pages.");
      // console.log(pageCrawler);
      geocoded = links.length + geocoded;
      pageCrawler.enqueue(links);

      console.log("Queueing next page for link gathering.\n");
      var nextPageLink = $("#nextpage").find("a").attr("href");
      nextPageLink && clCrawler.enqueue(baseURL + nextPageLink);
      clCrawler.iterNum--;
    }
    else {
      return;
    }
  }
});

clCrawler.iterNum = pages = 2;
clCrawler.enqueue(baseURL);
