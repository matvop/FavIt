'use strict';
/**
 * Send user's 'Fav' entry to the server
 */
function postFav(mediaURL, comment) {
  $.ajax({
    url: 'create_fav/', // the endpoint
    type: 'POST', // http method
    data: {
      url_text: mediaURL,
      comment_text: comment,
    }, // data sent with the post request
    // handle a successful response
    success: function(json) {
      console.log(json); // log the returned json to the console
    },
    // handle a non-successful response
    error: function(xhr, errmsg, err) {
      $('fieldset').children('.url-input').val('');
      $('fieldset').children('.comment-input').val('');
      $('#results').html('<div class=\'alert-box alert radius' +
      'data-alert>Oops! We have encountered an error: ' + errmsg +
      '<a href=\'#\' class=\'close\'>&times;</a></div>'); // add the error to the dom
      console.log(xhr.status + ': ' + xhr.responseText); // provide a bit more info about the error to the console
    }
  });
}
