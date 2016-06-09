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
    error: function(xhr, errmsg, err) {
      $('#results').html('<div class=\'alert-box alert radius\'' +
      'data-alert>Oops! We have encountered an error: ' + errmsg +
      '<a href=\'#\' class=\'close\'>&times;</a></div>'); // add the error to the dom
      console.log(xhr.status + ': ' + xhr.responseText); // provide a bit more info about the error to the console
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
    error: function(xhr, errmsg, err) {
      $('#results').html('<div class=\'alert-box alert radius\'' +
      'data-alert>Oops! We have encountered an error:' + errmsg +
      '<a href=\'#\' class=\'close\'>&times;</a></div>'); // add the error to the dom
      console.log(xhr.status + ': ' + xhr.responseText); // provide a bit more info about the error to the console
    }
  });
}
