'use strict';

/**
 * [loadFavs description]
 * @param  {[type]} jsonDict [description]
 * @return {[type]}      [description]
 */
function loadFavs(jsonDict) {
  for (var i = 0; i < jsonDict.fav_list.length; i++) {
    var mediaURL = jsonDict.fav_list[i].media_url;
    checkTypeBuildTile(mediaURL);
  }
}

/**
 *
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
 *
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
