'use strict';

/**
 * Clear and close the Fav input form.
 */
function resetForm() {
  $('fieldset').children('.url-input').val('');
  $('fieldset').children('.comment-input').val('');
  $('.url-input').css('background-color', '#3C3C3C');
  $('#fav-form').magnificPopup('close');
}

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
      checkTypeBuildTile(mediaURL);
      resetForm();
    },
    // handle a non-successful response
    error: function(json) {
      if (json.status === 0) {
        console.log('Unable to communcate with server.' +
          json.statusText + ' ' + json.status);
        alert('Unable to connect to server. Please try again later.');
      } else {
        console.log('Server was sent mediaURL: ' + mediaURL);
        console.log(json);
        console.log(json.statusText + ' ' + json.status);
        console.log(json.responseText);
        alert('Internal server error. Please check log.');
      }
    }
  });
}
