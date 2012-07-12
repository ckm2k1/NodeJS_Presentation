/*global coordCache:false*/

var geocoder = new google.maps.Geocoder();
//Create the google map
var map;
var markers = [];

function initialize() {
  var myOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map($("#map_canvas").get(0), myOptions);
  //Initialize the map to Montreal
  map.setCenter(new google.maps.LatLng(45.50866990, -73.55399249999999));


  for (var x = 0; x < coordCache.length; x++) {
    var coords = coordCache[x].coords
    , marker = new google.maps.Marker({
          position: new google.maps.LatLng(coords.lat, coords.lng)
        , map: map
      });

    var contentString =   "<h2>" + coordCache[x].title + "</h2>"
                          + coordCache[x].body
                          + "<a href='" + coordCache[x].clPostURL + "'>Link to original CL post</a>";

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    marker.infoWindow = infowindow;

    markers.push(marker);
    // console.log(coords["$a"] + " : "+ coords["ab"]);
  }
  //Initialize the markers' click event with the CL info window.
  $.each(markers, function(index, value) {
    google.maps.event.addListener(value, 'click', function() {
      for (var i = 0; i < markers.length; i++) {
        if (markers[i] !== value) markers[i].infoWindow.close();
      };
      var index = markers.indexOf(value);
      markers[index].infoWindow.open(map,value);
    });
  });
}