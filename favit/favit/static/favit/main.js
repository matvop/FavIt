'use strict';

var mq = window.matchMedia('(min-width: 481px)');

var imageBuffer = [];

var imgurSupport = 'Supported Imgur URL formats:\n\n' +
'Gallery Image URL:\nhttps://imgur.com/gallery/J1xff44\n' +
'Gallery Album URL (option 1):\nhttp://imgur.com/gallery/hOF1g\n' +
'Gallery Album URL (option 2):\nhttp://imgur.com/a/hOF1g\n' +
'Account Favorites URL:\nhttp://imgur.com/account/favorites/lpo6i9h\n\n';

var videoSupport = 'Supported Video URL formats:\n\n' +
  'YouTube Direct URL:\nhttps://www.youtube.com/watch?v=X0z2i83fmMk\n' +
  'YouTube Direct w/PL:\nhttps://www.youtube.com/watch?v=XFkzRNyygfk&list=' +
    'PL6...\n' +
  'youtu.be Share URL:\nhttps://youtu.be/X0z2i83fmMk\n' +
  'Vimeo Direct URL:\nhttps://vimeo.com/26645299\n\n';

var optionalStrings = 'Optional Strings:\n\n"http(s)://" and "www."';

var help = imgurSupport + videoSupport + optionalStrings;

var youtubePattern = new RegExp(
  '^' +
    // protocol identifier
    '(?:https?:\\/\\/)?' +
    // host name
    '(?:www\\.)?' +
    // domain and path
    '(?:youtu\\.be\\/|youtube\\.com/' +
      '(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))' +
    // id and arguements
    '((\\w|-){11})((?:\\S){0,128})?' +
  '$'
);

var imgurPattern = new RegExp(
  '^' +
    // protocol identifier
    '(?:https?:\\/\\/)?' +
    // host name
    '(?:www\\.)?' +
    // domain and path
    '(?:imgur\\.com\\/(?:a\\/|account\\/favorites\\/|gallery\\/)?)' +
    // id
    '(\\w{5,7})' +
  '$'
);

var vimeoPattern = new RegExp(
  '^' +
    // protocol identifier
    '(?:https?:\\/\\/)?' +
    // host name
    '(?:www\\.)?' +
    // domain and path
    '(?:vimeo\\.com\\/)' +
    // id
    '([0-9]{8,9})' +
  '$'
);


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
    imgurTile.find('.thumb').addClass('static');
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
    imgurTile.find('.author').text('Animated Album').attr(
      'href', json.data.link);
    imgurTile.find('.thumb').addClass('static');
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
 *
 */
function changeToAnimated(imgurTile, jsonData) {
  return imgurTile.find('.thumb').attr('src', 'http://i.imgur.com/' +
    jsonData.id + '.gif').removeClass('static').addClass('gif');
}

/**
 *
 */
function changeToStatic(imgurTile, jsonData) {
  return imgurTile.find('.thumb').attr('src', 'http://i.imgur.com/' +
    jsonData.id + 'm.gif').removeClass('gif').addClass('static');
}

/**
 * Take in Imgur's gallery endpoint json response and empty Fav HTML tile
 * object and modify empty tile to add data from the json response
 */
function convertEmptyTileToImgurGal(json, emptyTile) {
  var imgurTile = emptyTile;
  var viewWidth = getViewWidth(json.data);
  imgurTile.toggleClass('imgur').css('width', viewWidth);
  imgurTile.find('.title').text(json.data.title);
  imgurTile.find('.publisher').text('Imgur').attr('href', 'https://imgur.com/');
  var imgurTile = checkGalleryAnimationSetAuthorField(imgurTile, json.data);
  var linkID = json.data.link.replace(
    'http://i.imgur.com/', '').replace(json.data.link.slice(-4), '');
  imgurTile = checkForBrokenGIF(linkID, imgurTile, json.data);
  // if image is animated and media query matches include image change event listeners
  if (json.data.animated && mq.matches) {
    imageBuffer.push($('<img />').attr('src', 'http://i.imgur.com/' +
      json.data.id + '.gif')); // brings image into memory for smoother loading
    $(document).on('scroll', function() {
      var tile = imgurTile;
      var data = json.data;
      if (tile.find('img').visible() && tile.find('img').hasClass('static')) {
        tile = changeToAnimated(tile, data);
      } else if (tile.find('img').visible() === false &&
        tile.find('img').hasClass('gif')) {
        tile = changeToStatic(tile, data);
      } else {
        console.log('already set');
      }
    });
    $('.thumb').on('load', function() {
      var tile = imgurTile;
      var data = json.data;
      if (tile.find('img').visible() && tile.find('img').hasClass('static')) {
        tile = changeToAnimated(tile, data);
      } else if (tile.find('img').visible() === false &&
        tile.find('img').hasClass('gif')) {
        tile = changeToStatic(tile, data);
      } else {
        console.log('already set');
      }
    });
  } else {
    return imgurTile;
  }
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
  // if image is animated and media query matches include image change event listeners
  if (jsonData.animated && mq.matches) {
    imageBuffer.push($('<img />').attr('src', 'http://i.imgur.com/' +
      jsonData.id + '.gif')); // brings image into memory for smoother loading
    $(document).on('scroll', function() {
      var tile = imgurTile;
      var data = jsonData;
      if (tile.find('img').visible() &&
        tile.find('img').hasClass('static')) {
        tile = changeToAnimated(tile, data);
      } else if (tile.find('img').visible() === false &&
        tile.find('img').hasClass('gif')) {
        tile = changeToStatic(tile, data);
      } else {
        console.log('already set');
      }
    });
    $('.thumb').on('load', function() {
      var tile = imgurTile;
      var data = jsonData;
      if (tile.find('img').visible() && tile.find('img').hasClass('static')) {
        tile = changeToAnimated(tile, data);
      } else if (tile.find('img').visible() === false &&
        tile.find('img').hasClass('gif')) {
        tile = changeToStatic(tile, data);
      } else {
        console.log('already set');
      }
    });
  } else {
    return imgurTile;
  }
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

/**
 * Parse video id from a valid YouTube URL.
 */
function resolveYoutubeId(url) {
  return url.match(youtubePattern) ? RegExp.$1 : false;
}

/**
 * Parse video id from a valid Vimeo URL.
 */
function resolveVimeoId(url) {
  return url.match(vimeoPattern) ? RegExp.$1 : false;
}

/**
 * Parse media id from a valid Imgur URL.
 */
function resolveImgurId(url) {
  return url.match(imgurPattern) ? RegExp.$1 : false;
}

/**
 * Checks submitted URL for match. Calls appropriate build function based
 * on result.
 */
function checkTypeBuildTile(mediaURL) {
  if (mediaURL.toLowerCase().includes('youtu')) {
    var id = resolveYoutubeId(mediaURL);
    buildYoutubeTile(id);
  } else if (mediaURL.toLowerCase().includes('vimeo')) {
    var id = resolveVimeoId(mediaURL);
    buildVimeoTile(id);
  } else if (mediaURL.toLowerCase().includes('imgur')) {
    var id = resolveImgurId(mediaURL);
    buildImgurTile(id);
  } else {
    throw new TypeError('checkTypeBuildTile FAILED - mediaURL: ' + mediaURL);
  }
}

/**
 * Validate user input and provide visual notification to user whether input
 * is acceptable for submission(called on keyup and on submit).
 */
function validateURLInput(mediaURL) {
  if (youtubePattern.test(mediaURL) === true ||
      imgurPattern.test(mediaURL) === true ||
      vimeoPattern.test(mediaURL) === true) {
    $('.url-input').css('background-color', 'limegreen');
    return true;
  } else if (mediaURL === '') {
    $('.url-input').css('background-color', '#3C3C3C');
  } else {
    $('.url-input').css('background-color', 'firebrick');
    return false;
  }
  throw new TypeError('Input Error (validateURLInput): ' + mediaURL);
}

/**
 * Check if input is valid and provide a helpful response if not.
 */
function validateForm(mediaURL) {
  if (validateURLInput(mediaURL) === false) {
    if (mediaURL.toLowerCase().includes('youtu') ||
        mediaURL.toLowerCase().includes('vimeo') ||
        mediaURL.toLowerCase().includes('video')) {
      alert(videoSupport + optionalStrings);
      throw new TypeError('Invalid Video URL: ' + mediaURL);
    } else if (mediaURL.toLowerCase().includes('imgur')) {
      alert(imgurSupport + optionalStrings);
      throw new TypeError('Invalid Imgur URL: ' + mediaURL);
    } else {
      alert(help);
      throw new TypeError('Invalid Media URL: ' + mediaURL);
    }
  } else {
    return true;
  }
}

/**
 * register mouse click input events from the user.
 */
function registerMouseEvents() {
  $('#recent-favs').on('click', function() {
    $('section').empty();
    getRecentFavs(); //located in get.js
  });
  $('#user-favs').on('click', function() {
    $('section').empty();
    getFavs(); //located in get.js
  });
  $('#imgur-logo').on('click', function() {
    $('.imgur').show();
    $('.vim').hide();
    $('.yt').hide();
  });
  $('#vimeo-logo').on('click', function() {
    $('.vim').show();
    $('.imgur').hide();
    $('.yt').hide();
  });
  $('#yt-logo').on('click', function() {
    $('.yt').show();
    $('.imgur').hide();
    $('.vim').hide();
  });
  $('.help').on('click', function(event) {
    event.preventDefault();
    alert(help);
  });
  $('.logos img').on('mousedown', function() {
    $('.imgur').show();
    $('.vim').show();
    $('.yt').show();
  })
}

/**
 * register parameters for magnific popup type forms.
 */
function registerForms() {
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: 'fieldset > input:first-of-type',
  });
}

/**
 * register keyup event behavior within the Fav url input.
 */
function registerKbEvents() {
  $('.url-input').on('keyup', function() {
    var mediaURL = $('.url-input').val();
    validateURLInput(mediaURL);
  });
}

/**
 * register submit button behavior in the Fav form.
 */
function registerFavFormSubmit() {
  $('#fav-form').on('submit', function(event) {
    event.preventDefault();
    var mediaURL = $('.url-input').val();
    var comment = $('.comment-input').val();
    if (validateForm(mediaURL) === true) {
      postFav(mediaURL, comment); //located in post.js
    } else {
      throw new TypeError('validateForm FAILED - mediaURL: ' + mediaURL);
    }
  });
}

/**
 * register the event handlers for validation, submission, and content
 * filtering.
 */
function registerGlobalEventHandlers() {
  registerMouseEvents();
  registerForms();
  registerKbEvents();
  registerFavFormSubmit();
}

/**
 * Starts up the application and loads Favs once the HTML document is fully loaded.
*/
$(document).ready(function() {
  getFavs(); //located in get.js
  registerGlobalEventHandlers();
});
