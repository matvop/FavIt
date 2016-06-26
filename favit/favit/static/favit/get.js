'use strict';

/**
 * Load the fav_list from the json response data into the main build tile function.
 */
function loadFavs(jsonDict) {
  var list = jsonDict.fav_list.reverse();
  for (var i = 0; i < list.length; i++) {
    var mediaURL = list[i].media_url;
    checkTypeBuildTile(mediaURL);
  }
}

/**
 * AJAX call to the server to retrieve a json response for building Fav tiles.
 */
function getRecentFavs() {
  $.ajax({
    url: 'recent_favs/', // the endpoint
    type: 'GET', // http method
    // handle a successful response
    success: function(result) {
      loadFavs(result);
    },
    // handle a non-successful response
    error: function() {
      alert('Error: Connection to server could not be established. ' +
            'Please check your network connection and try again.');
    }
  });
}

/**
 * AJAX call to the server to retrieve a json response for building Fav tiles for the user profile.
 */
function getFavs() {
  $.ajax({
    url: 'get_favs/', // the endpoint
    type: 'GET', // http method
    // handle a successful response
    success: function(result) {
      loadFavs(result);
    },
    // handle a non-successful response
    error: function() {
      alert('Error: Connection to server could not be established. ' +
            'Please check your network connection and try again.');
    }
  });
}
