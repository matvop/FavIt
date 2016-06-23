'use strict';

/**
 * Update dynamic class element to show current number of Favs in their view.
 */
function updateTileCount() { //feature may or may not be re-enabled
  var tileCount = $('article').length;
  return $('.dynamic').text('Favs in your gallery: ' + tileCount);
}

/**
 * Create hyplerlink which includes an event handler to delete Fav on click.
 * Currently only hides Fav from view until the Favs are reloaded.
 */
function createDelLink(tileElement) {
  var delLink = $('<a></a>').text('X').attr('href', '');
  delLink.on('click', function(event) {
    event.preventDefault();
    tileElement.remove('article');
    updateTileCount();
  });
  return delLink;
}

/**
 * Return empty Fav HTML tile object which can be converted to suit any media
 * type.
 */
function createEmptyTile() {
  var imageElement = $('<img></img>').attr(
    'src', '').toggleClass('thumb');
  var fullSizeLink = $('<a></a>').attr('href', '').append(
    imageElement);
  var topContainerElement = $('<div></div>').toggleClass(
    'top-cont').append(fullSizeLink);
  var tileElement = $('<article></article>').append(topContainerElement);
  var titleElement = $('<div></div>').toggleClass('title');
  var delLink = createDelLink(tileElement);
  var commentHeaderElement = $('<span></span>').append(
    titleElement, delLink);
  var authorLinkElement = $('<a></a>').attr(
    'href', '').attr('target', '_blank').toggleClass('author');
  var authorDiv = $('<div></div>').toggleClass('auth-div').append(
      authorLinkElement);
  var publisher = $('<a></a>').toggleClass('publisher').attr(
    'target', '_blank');
  var seperatorAndPublisher = $('<div></div>').toggleClass('pub-div').append(
    publisher);
  var mediaSourceElement = $('<div></div>').toggleClass('source').append(
    authorDiv, seperatorAndPublisher);
  var flexDivElement = $('<div></div>').toggleClass('comment').append(
    commentHeaderElement, mediaSourceElement);
  tileElement.append(flexDivElement);
  return tileElement;
}

/**
 * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 */
function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
  var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: Math.round(srcWidth * ratio),
    height: Math.round(srcHeight * ratio)
  };
}

/**
 * Remove thumbnail suffix from the URL path.
 */
function removeThumbnailSuffixFromGIFLinkID(link) {
  return link.replace('h.gif', '.gif');
}

/**
 * Remove existing thumbnail suffix and replace with medium quality
 * thumbnail suffix 'm'.
 */
function changeThumbnailSuffix(link) {
  return link.replace('h.gif', 'm.gif');
}

/**
 * Append 'm' to the end of a normal ID in the URL path, which provides a medium
 * quality thumbnail.
 */
function addThumbnailSuffix(link) {
  return link.replace(link.slice(-4), 'm' + link.slice(-4));
}

/**
* Fixes purposely broken GIF link, so that the GIF is animated and not just a
* thumbnail. Changes thumbnail link from high res to medium.
 */
function fixAndSetImageSrcAndThumb(imgurTile, jsonData) {
  var correctGIFLink = removeThumbnailSuffixFromGIFLinkID(jsonData.link);
  var updatedThumbLink = changeThumbnailSuffix(jsonData.link);
  imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
    'href', correctGIFLink);
  imgurTile.find('img').attr('src', updatedThumbLink);
  return imgurTile;
}

/**
 * Set anchor tag href to the full size image url path and set the tile img src
 * to the thumbnail url path.
 */
function setImageSrcAndThumb(imgurTile, jsonData) {
  var linkWithThumbSuffix = addThumbnailSuffix(jsonData.link);
  imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
    'href', jsonData.link);
  imgurTile.find('img').attr('src', linkWithThumbSuffix);
  return imgurTile;
}

/**
 * Calculate the proper thumbnail width (pixels) based on a pre-defined height
 * while maintaining the original aspect ratio. Returned width must not be less
 * than 90px as it will cause layout issues in displayed HTML.
 */
function getViewWidth(jsonData) {
  var srcWidth = jsonData.width;
  var srcHeight = jsonData.height;
  var imageSize = calculateAspectRatioFit(srcWidth, srcHeight, 248, 140);
  var viewWidth = imageSize.width;
  if (viewWidth < 90) {
    viewWidth = 90;
  }
  return viewWidth;
}

/**
 * GALLERY Check if image is animated. Include result in the unused author field.
 */
function checkGalleryAnimationSetAuthorField(imgurTile, jsonData) {
  if (jsonData.animated === true) {
    imgurTile.find('.author').text('Animated GIF').attr(
      'href', 'https://imgur.com/gallery/' + jsonData.id);
  } else {
    imgurTile.find('.author').text('Image').attr(
      'href', 'https://imgur.com/gallery/' + jsonData.id);
  }
  return imgurTile;
}

/**
 * ALBUM Check if image is animated. Include result in the unused author field.
 */
function checkAlbumAnimationSetAuthorField(imgurTile, json) {
  if (json.data.images[0].animated === true) {
    imgurTile.find('.author').text('Animated GIF').attr(
      'href', json.data.images[0].link);
  } else {
    imgurTile.find('.author').text('Album').attr(
      'href', json.data.link);
  }
  return imgurTile;
}

/**
 * Check if the GIF link already has a thumbnail suffix. Modify it accordingly.
 */
function checkForBrokenGIF(linkID, imgurTile, jsonData) {
  if (linkID.length > 7) {
    imgurTile = fixAndSetImageSrcAndThumb(imgurTile, jsonData);
  } else {
    imgurTile = setImageSrcAndThumb(imgurTile, jsonData);
  }
  return imgurTile;
}

/**
 * Take in Imgur's gallery endpoint json response and empty Fav HTML tile
 * object and modify empty tile to add data from the json response
 */
function convertEmptyTileToImgurGal(json, emptyTile) {
  // console.dir(json);
  var imgurTile = emptyTile;
  var viewWidth = getViewWidth(json.data);
  imgurTile.toggleClass('imgur').css('width', viewWidth);
  imgurTile.find('.title').text(json.data.title);
  imgurTile.find('.publisher').text('Imgur').attr('href', 'https://imgur.com/');
  var imgurTile = checkGalleryAnimationSetAuthorField(imgurTile, json.data);
  var linkID = json.data.link.replace(
    'http://i.imgur.com/', '').replace(json.data.link.slice(-4), '');
  imgurTile = checkForBrokenGIF(linkID, imgurTile, json.data);
  return imgurTile;
}


/**
 * Take in Imgur's album endpoint json response and empty Fav HTML tile
 * object and modify empty tile to add data from the json response
 */
function convertEmptyTileToImgurAlb(json, emptyTile) {
  // console.dir(json);
  var imgurTile = emptyTile;
  var jsonData = json.data.images[0];
  var viewWidth = getViewWidth(jsonData);
  var link = jsonData.link;   //important declaration
  imgurTile.toggleClass('imgur').css('width', viewWidth);
  imgurTile.find('.title').text(json.data.title);
  imgurTile.find('.publisher').text('Imgur').attr('href', 'https://imgur.com/');
  var imgurTile = checkAlbumAnimationSetAuthorField(imgurTile, json);
  var linkID = link.replace('http://i.imgur.com/', '').replace(
    link.slice(-4), '');
  imgurTile = checkForBrokenGIF(linkID, imgurTile, jsonData);
  return imgurTile;
}

/**
 * Get JSON response from Imgur's gallery API endpoint. Requires
 * 7 digit id. Calls the empty tile func and converts to gallery tile then
 * pre-pends to the section element in the DOM.
 */
function buildFromGalleryEndpointResponse(id) {
  var emptyTile = createEmptyTile();
  $('section').prepend(emptyTile);
  updateTileCount();
  $.ajax({
    dataType: 'json',
    url: 'https://api.imgur.com/3/gallery/image/' + id,
    headers: {Authorization: 'Client-ID 5225450d88ff546'},
    success: function(result) {
      convertEmptyTileToImgurGal(result, emptyTile);
      $('.image-popup-no-margins').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-no-margins mfp-with-zoom',
        image: {
          verticalFit: true
        },
        zoom: {
          enabled: true, // enable or disable css zoom animation for popup
          duration: 500 // don't foget to change the duration also in CSS
        }
      });
    }
  });
}

/**
* Get JSON response from Imgur's album API endpoint. Requires
* 5 digit id. Calls the empty tile func and converts to gallery tile then
* pre-pends to the section element in the DOM
 */
function buildFromAlbumEndpointResponse(id) {
  var emptyTile = createEmptyTile();
  $('section').prepend(emptyTile);
  updateTileCount();
  $.ajax({
    dataType: 'json',
    url: 'https://api.imgur.com/3/gallery/album/' + id,
    headers: {Authorization: 'Client-ID 5225450d88ff546'},
    success: function(result) {
      convertEmptyTileToImgurAlb(result, emptyTile);
      $('.image-popup-no-margins').magnificPopup({
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-no-margins mfp-with-zoom',
        image: {
          verticalFit: true
        },
        zoom: {
          enabled: true, // enable or disable css zoom animation for popup
          duration: 500 // don't foget to change the duration also in CSS
        }
      });
    }
  });
}

/**
 * Determine length of ID and call related AJAX function
 */
function buildImgurTile(id) {
  if (id.length === 7) { //for image gallery
    buildFromGalleryEndpointResponse(id);
  }  else if (id.length === 5) { //for image albums
    buildFromAlbumEndpointResponse(id);
  } else {
    alert('The Imgur URL provided is malformed.');
    throw new TypeError('Unexpected ID: ' + id);
  }
}

/**
* Take in noEmbed's json response for the YouTube URL with empty Fav HTML tile
* object and modify empty tile to add data from the json response
 */
function convertEmptyTileToYoutube(json, emptyTile) {
  var youtubeTile = emptyTile;
  youtubeTile.toggleClass('yt');
  youtubeTile.find('.top-cont > a').toggleClass(
    'popup-youtube').attr('href', json.url);
  youtubeTile.find('img').attr('src', json.thumbnail_url);
  youtubeTile.find('.title').text(json.title);
  youtubeTile.find('.author').attr('href', json.author_url).text(
    json.author_name);
  youtubeTile.find('.publisher').text(json.provider_name).attr(
    'href', json.provider_url);
  return youtubeTile;
}

/**
* Get JSON response from noEmbed's url endpoint. Creates empty tile and converts
* to a YouTube tile then pre-pends to the section element in the DOM
 */
function buildYoutubeTile(id) {
  var emptyTile = createEmptyTile();
  $('section').prepend(emptyTile);
  updateTileCount();
  $.ajax({
    dataType: 'json',
    url: 'https://noembed.com/embed',
    data: 'url=' + 'https://www.youtube.com/watch?v=' + id,
    success: function(result) {
      convertEmptyTileToYoutube(result, emptyTile);
      $('.popup-youtube').magnificPopup({
        disableOn: 0,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
      });
    }
  });
}

/**
* Take in noEmbed's json response for the Vimeo URL with empty Fav HTML tile
* object and modify empty tile to add data from the json response
 */
function convertEmptyTileToVimeo(json, emptyTile) {
  var vimeoTile = emptyTile;
  vimeoTile.toggleClass('vim');
  vimeoTile.find('.top-cont > a').attr('href', json.url).toggleClass(
    'popup-vimeo');
  vimeoTile.find('img').attr('src', json.thumbnail_url);
  vimeoTile.find('.title').text(json.title);
  vimeoTile.find('.author').attr('href', json.author_url).text(
    json.author_name);
  vimeoTile.find('.publisher').text(json.provider_name).attr(
    'href', json.provider_url);
  return vimeoTile;
}

/**
* Get JSON response from noEmbed's url endpoint. Creates empty tile and converts
* to a Vimeo tile then pre-pends to the section element in the DOM
 */
function buildVimeoTile(id) {
  var emptyTile = createEmptyTile();
  $('section').prepend(emptyTile);
  updateTileCount();
  $.ajax({
    dataType: 'json',
    url: 'https://noembed.com/embed',
    data: 'url=' + 'https://vimeo.com/' + id,
    success: function(result) {
      convertEmptyTileToVimeo(result, emptyTile);
      $('.popup-vimeo').magnificPopup({
        disableOn: 0,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
      });
    }
  });
}

var regYoutube = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
var regImgur = /(?:https?:\/\/)?(?:imgur\.com\/(?:a\/|account\/favorites\/|gallery\/))(\w{5,7})(?:\S+)?$/;
// var regImgur = /(?:https?:\/\/)?(?:i\.)?imgur\.com\/(?:account\/favorites\/)?(?:a\/)?(?:gallery\/)?(.+(?=[sbtmlh]\..{3,4})|.+(?=‌​\..{3,4})|.+?(?:(?=\s)|$))/;
var regVimeo = /(?:https?:\/\/)?vimeo\.com\/([0-9]{8,9})$/;

/**
 * Return video id from a valid YouTube URL.
 */
function resolveYoutubeId(url) {
  return url.match(regYoutube) ? RegExp.$1 : false;
}

/**
 * [resolveVimeoId description]
 */
function resolveVimeoId(url) {
  return url.match(regVimeo) ? RegExp.$1 : false;
}

/**
 * [resolveImgurId description]
 */
function resolveImgurId(url) {
  return url.match(regImgur) ? RegExp.$1 : false;
}

/**
 * [validateURLInput description]
 */
function validateURLInput(mediaURL) {
  if (regYoutube.test(mediaURL) === true ||
      regImgur.test(mediaURL) === true ||
      regVimeo.test(mediaURL) === true) {
    $('.url-input').css('background-color', 'lightgreen');
    return true;
  } else {
    $('.url-input').css('background-color', 'pink');
    return false;
  }
}

/**
 * [alertVideoSupport description]
 */
function alertVideoSupport() {
  return alert(
    'Supported Video URL formats:\n\n' +
    '* YouTube Direct URL: https://www.youtube.com/watch?v=X0z2i83fmMk\n' +
    '* YouTube Direct w/PL: https://www.youtube.com/watch?v=XFkzRNyygfk&list=' +
      'PL67y-alyKlu-ZjwMz92LE9gJ5m0c7iipy\n' +
    '* youtu.be Share URL: https://youtu.be/X0z2i83fmMk\n' +
    '* Vimeo Direct URL: https://vimeo.com/26645299\n');
}

/**
 * [alertImgurSupport description]
 */
function alertImgurSupport() {
  return alert(
    'Supported Imgur URL formats:\n\n' +
    'Gallery Image URL: https://imgur.com/gallery/J1xff44\n' +
    'Gallery Album URL (option 1): http://imgur.com/gallery/hOF1g\n' +
    'Gallery Album URL (option 2): http://imgur.com/a/hOF1g\n' +
    'Account Favorites URL: http://imgur.com/account/favorites/lpo6i9h');
}

/**
 * [validateForm description]
 */
function validateForm(mediaURL) {
  if (validateURLInput(mediaURL) === false) {
    if (mediaURL.includes('youtu') || mediaURL.includes('vimeo')) {
      alertVideoSupport();
      throw new TypeError('Invalid Video URL: ' + mediaURL);
    } else if (mediaURL.includes('imgur')) {
      alertImgurSupport();
      throw new TypeError('Invalid Imgur URL: ' + mediaURL);
    } else {
      alert('A proper media URL from a supported content provider is required');
      throw new TypeError('Invalid Media URL: ' + mediaURL);
    }
  } else {
    return true;
  }
}


/**
 * Checks submitted URL for match. Calls appropriate build function based
 * on result.
 */
function checkTypeBuildTile(mediaURL) {
  if (mediaURL.includes('youtube') || mediaURL.includes('youtu.be')) {
    var id = resolveYoutubeId(mediaURL);
    buildYoutubeTile(id);
    return mediaURL;
  } else if (mediaURL.includes('vimeo')) {
    var id = resolveVimeoId(mediaURL);
    buildVimeoTile(id);
    return mediaURL;
  } else if (mediaURL.includes('imgur')) {
    var id = resolveImgurId(mediaURL);
    buildImgurTile(id);
    return mediaURL;
  } else {
    throw new TypeError('checkTypeBuildTile FAILED - mediaURL: ' + mediaURL);
  }
}

/**
 * Set's up the event handler for the submit button on #fav-form.
 */
function registerGlobalEventHandlers() {
  $('.url-input').on('keyup', function(event) {
    event.preventDefault();
    var mediaURL = $('.url-input').val();
    validateURLInput(mediaURL);
  });
  $('#fav-form').on('submit', function(event) {
    event.preventDefault();
    var mediaURL = $('.url-input').val();
    var comment = $('.comment-input').val();
    if (validateForm(mediaURL) === true) {
      $('fieldset').children('.url-input').val('');
      $('fieldset').children('.comment-input').val('');
      $('#fav-form').magnificPopup('close');
      mediaURL = checkTypeBuildTile(mediaURL);
      postFav(mediaURL, comment); //located in post.js
    } else {
      throw new TypeError('validateForm FAILED - mediaURL: ' + mediaURL);
    }
  });
  $('#recent-favs').on('mouseup', function() {
    $('section').empty();
    getRecentFavs(); //located in get.js
  });
  $('#user-favs').on('mouseup', function() {
    $('section').empty();
    getFavs(); //located in get.js
  });
  $('#imgur-logo').on('mouseup', function() {
    $('.imgur').show();
    $('.vim').hide();
    $('.yt').hide();
  });
  $('#vimeo-logo').on('mouseup', function() {
    $('.vim').show();
    $('.imgur').hide();
    $('.yt').hide();
  });
  $('#yt-logo').on('mouseup', function() {
    $('.yt').show();
    $('.imgur').hide();
    $('.vim').hide();
  });
  $('.supported').on('mouseup', function() {
    $('.imgur').show();
    $('.vim').show();
    $('.yt').show();
  });
}

/**
 * Starts up the application and loads Favs once the HTML document is fully loaded.
*/
$(document).ready(function() {
  registerGlobalEventHandlers();
  getFavs(); //located in get.js
  // updateTileCount();
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: 'fieldset > input:first-of-type',
  });
});
