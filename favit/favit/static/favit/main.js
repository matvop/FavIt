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
  return link.replace(link.slice(-5), link.slice(-4));
}

/**
 * Remove existing thumbnail suffix and replace with medium quality
 * thumbnail suffix 'm'.
 */
function changeThumbnailSuffix(link) {
  return link.replace(link.slice(-5), 'm' + link.slice(-4));
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
 * Calculate the proper thumbnail width based on a pre-defined height while
 * maintaining the original aspect ratio.
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
 * Check if image is animated. Include result in the unused author field.
 */
function checkAnimationSetAuthorField(imgurTile, jsonData) {
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
 * Check if the GIF link already has a thumbnail suffix. Modify it accordingly.
 */
function checkForBrokenGIF(linkID, imgurTile, jsonData) {
  if (linkID.length > 7) {
    imgurTile = fixAndSetImageSrcAndThumb(imgurTile, jsonData);
  }  else {
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
  var imgurTile = checkAnimationSetAuthorField(imgurTile, json.data);
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
  var imgurTile = checkAnimationSetAuthorField(imgurTile, jsonData);
  var linkID = link.replace('http://i.imgur.com/', '').replace(
    link.slice(-4), '');
  imgurTile = checkForBrokenGIF(linkID, imgurTile, jsonData);
  return imgurTile;
}

/**
 * Resolve the ID at end of an Imgur URL
 */
function resolveID(mediaURL) {
  if (mediaURL.slice(0,19) === 'https://imgur.com/g') {
    var id = mediaURL.replace('https://imgur.com/gallery/', '');
  } else if (mediaURL.slice(0,29) === 'https://imgur.com/account/fav') {
    var id = mediaURL.replace('https://imgur.com/account/favorites/', '');
  } else if (mediaURL.slice(0,20) === 'https://imgur.com/a/') {
    var id = mediaURL.replace('https://imgur.com/a/', '');
  } else {
    throw new TypeError('Resolve ID FAILED' + mediaURL);
  }
  return id;
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
          enabled: false,
          duration: 500 // don't foget to change the duration also in CSS
        }
      });
      $('fieldset').children('.url-input').val('');
      $('fieldset').children('.comment-input').val('');
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
          enabled: false,
          duration: 500 // don't foget to change the duration also in CSS
        }
      });
      $('fieldset').children('.url-input').val('');
      $('fieldset').children('.comment-input').val('');
    }
  });
}

/**
 * Determine length of ID and call related AJAX function
 */
function buildImgurTile(mediaURL) {
  var id = resolveID(mediaURL);
  if (id.length === 7) { //for image gallery
    buildFromGalleryEndpointResponse(id);
  }  else if (id.length === 5) { //for image albums
    buildFromAlbumEndpointResponse(id);
  } else {
    throw new TypeError('Unexpected ID' + id);
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
function buildYoutubeTile(mediaURL) {
  var emptyTile = createEmptyTile();
  $('section').prepend(emptyTile);
  updateTileCount();
  $.ajax({
    dataType: 'json',
    url: 'https://noembed.com/embed',
    data: 'url=' + mediaURL,
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
      $('fieldset').children('.url-input').val('');
      $('fieldset').children('.comment-input').val('');
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
function buildVimeoTile(mediaURL) {
  var emptyTile = createEmptyTile();
  $('section').prepend(emptyTile);
  updateTileCount();
  $.ajax({
    dataType: 'json',
    url: 'https://noembed.com/embed',
    data: 'url=' + mediaURL,
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
      $('fieldset').children('.url-input').val('');
      $('fieldset').children('.comment-input').val('');
    }
  });
}

/**
 * Check if the URL provided is a direct path with a file extension. Currently
 * not in use.
 */
function checkForFileExt(url) { // feature will be re-enabled in the future
  if (url.charAt(url.length - 4) === '.') {
    var fileExt = url.slice(-3);
  }  else if (url.charAt(url.length - 5) === '.') {
    var fileExt = url.slice(-4);
  }
  return fileExt;
}

/**
 * Checks submitted URL for match. Calls appropriate build function based
 * on result.
 */
function checkTypeBuildTile(mediaURL) {
  // var fileExt = checkForFileExt(mediaURL);
  if (mediaURL.slice(0,24) === 'https://www.youtube.com/') {
    buildYoutubeTile(mediaURL);
  } else if (mediaURL.slice(0,18) === 'https://vimeo.com/') {
    buildVimeoTile(mediaURL);
  } else if (mediaURL.slice(0, 17) === 'http://imgur.com/') {
    mediaURL = mediaURL.replace('http', 'https');
    buildImgurTile(mediaURL);
  } else if (mediaURL.slice(0, 18) === 'https://imgur.com/') {
    buildImgurTile(mediaURL);
  } else if (mediaURL.slice(0, 19) === 'http://i.imgur.com/') { //feature not implemented
    mediaURL = mediaURL.replace('http', 'https');
    buildImgurTile(mediaURL);
  } else if (mediaURL.slice(0,20) === 'https://i.imgur.com/') { //feature not implemented
    buildImgurTile(mediaURL);
  } else {
    throw new TypeError('checkTypeBuildTile FAILED' + mediaURL);
  }
  // else if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'bmp') {
  //   getUrlAndAddImgToGrid(mediaURL);
  // }  else if (fileExt === 'gif') {
  //   getUrlAndAddGifToGrid(mediaURL);
  // }
}

/**
 * Set's up the event handler for the submit button on #fav-form.
 */
function registerGlobalEventHandlers() {
  $('#fav-form').on('submit', function(event) {
    event.preventDefault();
    var mediaURL = $('.url-input').val();
    var comment = $('.comment-input').val();
    $('#fav-form').magnificPopup('close');
    checkTypeBuildTile(mediaURL);
    postFav(mediaURL, comment); //located in post.js
  });
  $('#recent-favs').on('mouseup', function() {
    $('section').empty();
    getRecentFavs(); //located in get.js
  });
  $('#user-favs').on('mouseup', function() {
    $('section').empty();
    getFavs(); //located in get.js
  });
}

/**
 * Starts up the application and loads Favs once the HTML document is fully loaded.
*/
$(document).ready(function() {
  registerGlobalEventHandlers();
  getFavs(); //located in get.js
  updateTileCount();
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: 'fieldset > input:first-of-type',
  });
});
