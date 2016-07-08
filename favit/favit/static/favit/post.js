'use strict';

/**
 * Clear and close the Fav input form.
 */
function resetForm() {
  $('fieldset').children('.url-input').val('');
  $('fieldset').children('.comment-input').val('');
  $('.url-input').css('background-color', 'white');
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
      // console.log(json); // log the returned json to the console
    },
    // handle a non-successful response
    error: function(json) {
      console.log(json);
      alert(json.statusText + ' ' + json.status + ' \n' +
            json.responseText);
    }
  });
}
