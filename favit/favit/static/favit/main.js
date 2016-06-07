'use strict';

/**
 * Update dynamic class element to show current number of Favs in their view.
 */
function updateTileCount() {
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
 * [removeThumbnailSuffixFromLinkID description]
 * @param  {[type]} link [description]
 * @return {[type]}      [description]
 */
function removeThumbnailSuffixFromGIFLinkID(link) {
  return link.replace(link.slice(-5), link.slice(-4));
}
function changeThumbnailSuffix(link) {
  return link.replace(link.slice(-5), 'm' + link.slice(-4));
}
function addThumbnailSuffix(link) {
  return link.replace(link.slice(-4), 'm' + link.slice(-4));
}

/**
 * Take in Imgur's API gallery endpoint json response and empty Fav HTML tile
 * object and convert empty tile to add data from the 's json response
 */
function convertEmptyTileToImgurGal(json, emptyTile) {
  // console.dir(json);
  var imgurTile = emptyTile;
  var srcWidth = json.data.width;
  var srcHeight = json.data.height;
  var imageSize = calculateAspectRatioFit(srcWidth, srcHeight, 248, 140);
  // console.log(imageSize);
  var viewWidth = imageSize.width;
  if (viewWidth < 90) {
    viewWidth = 90;
  }
  imgurTile.toggleClass('imgur').css('width', viewWidth);

  if (json.data.animated === true) {
    imgurTile.find('.author').text('Animated GIF').attr(
      'href', 'https://imgur.com/gallery/' + json.data.id);
    var linkID = json.data.link.replace(
      'http://i.imgur.com/', '').replace(json.data.link.slice(-4), '');
  } else {
    imgurTile.find('.author').text('Image').attr(
      'href', 'https://imgur.com/gallery/' + json.data.id);
    var linkID = json.data.link.replace(
      'http://i.imgur.com/', '').replace(json.data.link.slice(-4), '');
  }

  if (linkID.length > 7) {
    // console.log('detected ID longer than 7');
    var correctGIFLink = removeThumbnailSuffixFromGIFLinkID(json.data.link);
    var updatedThumbLink = changeThumbnailSuffix(json.data.link);
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', correctGIFLink);
    imgurTile.find('img').attr('src', updatedThumbLink);
  }  else {
    var linkWithThumbSuffix = addThumbnailSuffix(json.data.link);
    // console.log('detected normal 5-7 char ID');
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', json.data.link);
    imgurTile.find('img').attr('src', linkWithThumbSuffix);
  }

  imgurTile.find('.title').text(json.data.title);
  imgurTile.find('.publisher').text('Imgur').attr(
    'href', 'https://imgur.com/');
  return imgurTile;
}

/**
 * [convertEmptyTileToImgurAlb description]
 * @param  {[type]} json  [description]
 * @param  {[type]} emptyTile [description]
 * @return {[type]}           [description]
 */
function convertEmptyTileToImgurAlb(json, emptyTile) {
  // console.dir(json);
  var imgurTile = emptyTile;
  var srcWidth = json.data.images[0].width;
  var srcHeight = json.data.images[0].height;
  var imageSize = calculateAspectRatioFit(srcWidth, srcHeight, 248, 140);
  // console.log(imageSize);
  var viewWidth = imageSize.width;
  if (viewWidth < 90) {
    viewWidth = 90;
  }
  imgurTile.toggleClass('imgur').css('width', viewWidth);
  imgurTile.find('.title').text(json.data.title);


  if (json.data.images[0].animated === true) {
    var linkID = json.data.images[0].link.replace(
      'http://i.imgur.com/', '').replace(json.data.images[0].link.slice(-4), '');
  }  else {
    var linkID = json.data.images[0].link.replace(
      'http://i.imgur.com/', '').replace(json.data.images[0].link.slice(-4), '');
  }


  if (linkID.length > 7) {
    // console.log('detected ID longer than 7');
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', json.data.images[0].link.replace(
      json.data.images[0].link.slice(
      -5), json.data.images[0].link.slice(-4))
    );
    imgurTile.find('img').attr('src', json.data.images[0].link.replace(
      json.data.images[0].link.slice(
      -5), 'm' + json.data.images[0].link.slice(-4))
    );
  }  else {
    // console.log('detected normal 5-7 char ID');
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', json.data.images[0].link
    );
    imgurTile.find('img').attr('src', json.data.images[0].link.replace(
      json.data.images[0].link.slice(
      -4), 'm' + json.data.images[0].link.slice(-4))
    );
  }


  if (json.data.images[0].animated === true) {
    imgurTile.find('.author').text('Animated Album').attr(
        'href', json.data.link);
  }  else {
    imgurTile.find('.author').text('Album').attr('href', json.data.link);
  }
  imgurTile.find('.publisher').text('Imgur').attr('href', 'https://imgur.com/');
  return imgurTile;
}


function resolveID(mediaURL) {
  if (mediaURL.slice(0,19) === 'https://imgur.com/g') {
    var id = mediaURL.replace('https://imgur.com/gallery/', '');
    // console.log('https: ' + id);
  } else if (mediaURL.slice(0,29) === 'https://imgur.com/account/fav') {
    var id = mediaURL.replace('https://imgur.com/account/favorites/', '');
    // console.log('https user fav: ' + id);
  } else if (mediaURL.slice(0,20) === 'https://imgur.com/a/') {
    var id = mediaURL.replace('https://imgur.com/a/', '');
    // console.log('https alb link2: ' + id);
  }
  return id;
}


/**
 * [buildImgurTile description]
 * @param  {[type]} mediaURL [description]
 * @return {[type]}          [description]
 */
function buildImgurTile(mediaURL) {
  var id = resolveID(mediaURL);
  if (id.length === 7) { //for image gallery
    $.ajax({
      dataType: 'json',
      url: 'https://api.imgur.com/3/gallery/image/' + id,
      headers: {Authorization: 'Client-ID 5225450d88ff546'},
      success: function(result) {
        var emptyTile = createEmptyTile();
        var imgurTile = convertEmptyTileToImgurGal(result, emptyTile);
        $('section').prepend(imgurTile);
        updateTileCount();
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
  }  else if (id.length === 5) { //for image albums
    $.ajax({
      dataType: 'json',
      url: 'https://api.imgur.com/3/gallery/album/' + id,
      headers: {Authorization: 'Client-ID 5225450d88ff546'},
      success: function(result) {
        var emptyTile = createEmptyTile();
        var imgurTile = convertEmptyTileToImgurAlb(result, emptyTile);
        $('section').prepend(imgurTile);
        updateTileCount();
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
}

/**
 * [convertEmptyTileToYoutube description]
 * @param  {[type]} json  [description]
 * @param  {[type]} emptyTile [description]
 * @return {[type]}           [description]
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
 * [buildYoutubeTile description]
 * @param  {[type]} mediaURL [description]
 * @return {[type]}          [description]
 */
function buildYoutubeTile(mediaURL) {
  $.ajax({
    dataType: 'json',
    url: 'https://noembed.com/embed',
    data: 'url=' + mediaURL,
    success: function(result) {
      var emptyTile = createEmptyTile();
      var youtubeTile = convertEmptyTileToYoutube(result, emptyTile);
      $('section').prepend(youtubeTile);
      updateTileCount();
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
 * [convertEmptyTileToVimeo description]
 * @param  {[type]} json  [description]
 * @param  {[type]} emptyTile [description]
 * @return {[type]}           [description]
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
 * [buildVimeoTile description]
 * @param  {[type]} mediaURL [description]
 * @return {[type]}          [description]
 */
function buildVimeoTile(mediaURL) {
  $.ajax({
    dataType: 'json',
    url: 'https://noembed.com/embed',
    data: 'url=' + mediaURL,
    success: function(result) {
      var emptyTile = createEmptyTile();
      var vimeoTile = convertEmptyTileToVimeo(result, emptyTile);
      $('section').prepend(vimeoTile);
      updateTileCount();
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

// /**
//  * [checkForFileExt description]
//  * @param  {[type]} url [description]
//  * @return {[type]}     [description]
//  */
// function checkForFileExt(url) {
//   if (url.charAt(url.length - 4) === '.') {
//     var fileExt = url.slice(-3);
//   }  else if (url.charAt(url.length - 5) === '.') {
//     var fileExt = url.slice(-4);
//   }
//   return fileExt;
// }

/**
 * [getUploadedMediaType description]
 * @param  {[type]} mediaURL [description]
 * @return {[type]}          [description]
 */
function checkTypeBuildTile(mediaURL) {
  // var fileExt = checkForFileExt(mediaURL);
  if (mediaURL.slice(0,24) === 'https://www.youtube.com/') {
    buildYoutubeTile(mediaURL);
    return 'youtube';
  } else if (mediaURL.slice(0,18) === 'https://vimeo.com/') {
    buildVimeoTile(mediaURL);
    return 'vimeo';
  } else if (mediaURL.slice(0, 17) === 'http://imgur.com/') {
    mediaURL = mediaURL.replace('http://imgur.com', 'https://imgur.com');
    buildImgurTile(mediaURL);
    return 'imgur';
  } else if (mediaURL.slice(0, 18) === 'https://imgur.com/') {
    buildImgurTile(mediaURL);
    return 'imgur';
  } else if (mediaURL.slice(0, 19) === 'http://i.imgur.com/') {
    buildImgurTile(mediaURL);
  } else if(mediaURL.slice(0,20) === 'https://i.imgur.com/') {
    buildImgurTile(mediaURL);
  }
  return false;
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
    postFav(mediaURL, comment);
  });
  $('#recent-favs').on('mouseup', function() {
    $('section').empty();
    getRecentFavs();
  });
  $('#user-favs').on('mouseup', function() {
    $('section').empty();
    getFavs();
  });
}

/**
 * Starts up the application and loads Favs once the HTML document is fully loaded.
*/
$(document).ready(function() {
  registerGlobalEventHandlers();
  getFavs();
  updateTileCount();
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '',
  });
});
