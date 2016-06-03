'use strict';

/**
 * [updateTileCount description]
 * @return {[type]} [description]
 */
function updateTileCount() {
  var tileCount = $('article').length;
  return $('.dynamic').text('Favs in your gallery: ' + tileCount);
}


/** DOCSTRING INFO
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
 * [createImgTileElement description]
 */
function createImgTileElement(url) {
  var imageElement = $('<img></img>').attr('src', url);
  var fullSizeLink = $('<a></a>').attr('href', url).append(
    imageElement).toggleClass('image-popup-no-margins');
  var topContainerElement = $('<div></div>').toggleClass(
    'top-cont').append(fullSizeLink);
  var tileElement = $('<article></article>').toggleClass(
    'img').append(topContainerElement);
  var titleElement = $('<div></div>').text(url);
  var delLink = createDelLink(tileElement);
  var commentHeaderElement = $('<span></span>').append(
    titleElement).append(delLink);
  var flexDivElement = $('<div></div>').toggleClass('comment').append(
    commentHeaderElement);
  tileElement.append(flexDivElement);
  $('.fav-input').children('#url-input').val('');
  $('.fav-input').children('#comment-input').val('');
  return tileElement;
}

/**
 * [createGifTileElement description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function createGifTileElement(url) {
  var imageElement = $('<img></img>').attr('src', url);
  imageElement.toggleClass('gif');
  var fullSizeLink = $('<a></a>').attr('href', url).append(
    imageElement).toggleClass('image-popup-no-margins');
  var topContainerElement = $('<div></div>').toggleClass(
    'top-cont').append(fullSizeLink);
  var tileElement = $('<article></article>').toggleClass(
    'gif').append(topContainerElement);
  var titleElement = $('<div></div>').text(url);
  var delLink = createDelLink(tileElement);
  var commentHeaderElement = $('<span></span>').append(
    titleElement).append(delLink);
  var flexDivElement = $('<div></div>').toggleClass('comment').append(
    commentHeaderElement);
  tileElement.append(flexDivElement);
  $('form').children('#url-input').val('');
  return tileElement;
}

/**
 * [createEmptyTile description]
 * @return {[type]} [description]
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
 * [convertEmptyTileToImgurGal description]
 * @param  {[type]} jsonDict  [description]
 * @param  {[type]} emptyTile [description]
 * @return {[type]}           [description]
 */
function convertEmptyTileToImgurGal(jsonDict, emptyTile) {
  console.log('gallery');
  console.log('link: ' + jsonDict.data.link);
  console.log('id: ' + jsonDict.data.id);
  console.log('title: ' + jsonDict.data.title);
  console.dir(jsonDict);
  var imgurTile = emptyTile;
  imgurTile.toggleClass('imgur');
  if (jsonDict.data.animated === true) {
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', jsonDict.data.link.replace(
        jsonDict.data.link.slice(
        -5), jsonDict.data.link.slice(-4)));
    imgurTile.find('img').attr('src', jsonDict.data.link);
    imgurTile.find('.author').text('Animated GIF').attr('href', 'https://imgur.com/gallery/' + jsonDict.data.id);
  }  else {
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', jsonDict.data.link);
    imgurTile.find('img').attr('src', jsonDict.data.link.replace(
      jsonDict.data.link.slice(
      -4), 'm' + jsonDict.data.link.slice(-4)));
    imgurTile.find('.author').text('Image').attr('href', 'https://imgur.com/gallery/' + jsonDict.data.id);
  }
  imgurTile.find('.title').text(jsonDict.data.title);
  imgurTile.find('.publisher').text('Imgur').attr(
    'href', 'https://imgur.com/');
  return imgurTile;
}

/**
 * [convertEmptyTileToImgurAlb description]
 * @param  {[type]} jsonDict  [description]
 * @param  {[type]} emptyTile [description]
 * @return {[type]}           [description]
 */
function convertEmptyTileToImgurAlb(jsonDict, emptyTile) {
  console.log('album');
  console.log('link: ' + jsonDict.data.link);
  console.log('id: ' + jsonDict.data.id);
  console.log('title: ' + jsonDict.data.title);
  console.dir(jsonDict);
  var imgurTile = emptyTile;
  imgurTile.toggleClass('imgur');
  imgurTile.find('.title').text(jsonDict.data.title);
  if (jsonDict.data.images[0].animated === true) {
    var linkID = jsonDict.data.images[0].link.replace(
      'http://i.imgur.com/', '').replace(jsonDict.data.images[0].link.slice(-4), '');
  }  else {
    var linkID = jsonDict.data.images[0].link.replace(
      'http://i.imgur.com/', '').replace(jsonDict.data.images[0].link.slice(-4), '');
  }
  if (linkID.length > 7) {
    console.log('detected ID longer than 7');
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', jsonDict.data.images[0].link.replace(
      jsonDict.data.images[0].link.slice(
      -5), jsonDict.data.images[0].link.slice(-4))
    );
    imgurTile.find('img').attr('src', jsonDict.data.images[0].link.replace(
      jsonDict.data.images[0].link.slice(
      -5), 'm' + jsonDict.data.images[0].link.slice(-4))
    );
  }  else {
    console.log('detected normal 5-7 char ID');
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
      'href', jsonDict.data.images[0].link
    );
    imgurTile.find('img').attr('src', jsonDict.data.images[0].link.replace(
      jsonDict.data.images[0].link.slice(
      -4), 'm' + jsonDict.data.images[0].link.slice(-4))
    );
  }
  if (jsonDict.data.images[0].animated === true) {
    imgurTile.find('.author').text('Animated Album').attr(
        'href', jsonDict.data.link);
  }  else {
    imgurTile.find('.author').text('Album').attr('href', jsonDict.data.link);
  }
  imgurTile.find('.publisher').text('Imgur').attr('href', 'https://imgur.com/');
  return imgurTile;
}

/**
 * [buildImgurTile description]
 * @param  {[type]} mediaURL [description]
 * @return {[type]}          [description]
 */
function buildImgurTile(mediaURL) {
  // if method === 'http_image' {
  //
  // }
  // else if method === 'https_image' {
  //
  // }
  // if (mediaURL.slice(0,19) === 'http://i.imgur.com/') {
  //   var id = mediaURL.replace('http://i.imgur.com/', '').replace(
  //     mediaURL.slice(-4), '')
  //       console.log('non https: ' + id);
  // }
  // else if (mediaURL.slice(0,20) === 'https://i.imgur.com/') {
  //   var id = mediaURL.replace('https://i.imgur.com/', '').replace(
  //     mediaURL.slice(-4), '')
  //       console.log('https: ' + id);
  // }
  if (mediaURL.slice(0,18) === 'http://imgur.com/g') {
    var id = mediaURL.replace('http://imgur.com/gallery/', '');
    console.log('non https: ' + id);
  }  else if (mediaURL.slice(0,19) === 'https://imgur.com/g') {
    var id = mediaURL.replace('https://imgur.com/gallery/', '');
    console.log('https: ' + id);
  }  else if (mediaURL.slice(0,28) === 'http://imgur.com/account/fav') {
    var id = mediaURL.replace('http://imgur.com/account/favorites/', '');
    console.log('http user fav: ' + id);
  }  else if (mediaURL.slice(0,29) === 'https://imgur.com/account/fav') {
    var id = mediaURL.replace('https://imgur.com/account/favorites/', '');
    console.log('https user fav: ' + id);
  }
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
            enabled: true,
            duration: 500 // don't foget to change the duration also in CSS
          }
        });
        $('.fav-input').children('#url-input').val('');
        $('.fav-input').children('#comment-input').val('');
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
            enabled: true,
            duration: 500 // don't foget to change the duration also in CSS
          }
        });
        $('.fav-input').children('#url-input').val('');
        $('.fav-input').children('#comment-input').val('');
      }
    });
  }
}

/**
 * [convertEmptyTileToYoutube description]
 * @param  {[type]} jsonDict  [description]
 * @param  {[type]} emptyTile [description]
 * @return {[type]}           [description]
 */
function convertEmptyTileToYoutube(jsonDict, emptyTile) {
  var youtubeTile = emptyTile;
  youtubeTile.toggleClass('yt');
  youtubeTile.find('.top-cont > a').toggleClass(
    'popup-youtube').attr('href', jsonDict.url);
  youtubeTile.find('img').attr('src', jsonDict.thumbnail_url);
  youtubeTile.find('.title').text(jsonDict.title);
  youtubeTile.find('.author').attr('href', jsonDict.author_url).text(
    jsonDict.author_name);
  youtubeTile.find('.publisher').text(jsonDict.provider_name).attr(
    'href', jsonDict.provider_url);
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
      $('.fav-input').children('#url-input').val('');
      $('.fav-input').children('#comment-input').val('');
    }
  });
}

/**
 * [convertEmptyTileToVimeo description]
 * @param  {[type]} jsonDict  [description]
 * @param  {[type]} emptyTile [description]
 * @return {[type]}           [description]
 */
function convertEmptyTileToVimeo(jsonDict, emptyTile) {
  var vimeoTile = emptyTile;
  vimeoTile.toggleClass('vim');
  vimeoTile.find('.top-cont > a').attr('href', jsonDict.url).toggleClass(
    'popup-vimeo');
  vimeoTile.find('img').attr('src', jsonDict.thumbnail_url);
  vimeoTile.find('.title').text(jsonDict.title);
  vimeoTile.find('.author').attr('href', jsonDict.author_url).text(
    jsonDict.author_name);
  vimeoTile.find('.publisher').text(jsonDict.provider_name).attr(
    'href', jsonDict.provider_url);
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
      $('.fav-input').children('#url-input').val('');
      $('.fav-input').children('#comment-input').val('');
    }
  });
}


/**
 * [getUrlAndAddImgToGrid description]
 * @param  {[type]} imgURL [description]
 * @return {[type]}        [description]
 */
function getUrlAndAddImgToGrid(imgURL) {
  var tileElement = createImgTileElement(imgURL);
  return $('section').prepend(tileElement);
}


/**
 * [getUrlAndAddGifToGrid description]
 * @param  {[type]} gifURL [description]
 * @return {[type]}        [description]
 */
function getUrlAndAddGifToGrid(gifURL) {
  var tileElement = createGifTileElement(gifURL);
  return $('section').prepend(tileElement);
}

/**
 * [checkForFileExt description]
 * @param  {[type]} url [description]
 * @return {[type]}     [description]
 */
function checkForFileExt(url) {
  if (url.charAt(url.length - 4) === '.') {
    var fileExt = url.slice(-3);
  }  else if (url.charAt(url.length - 5) === '.') {
    var fileExt = url.slice(-4);
  }
  return fileExt;
}

/**
 * [getUploadedMediaType description]
 * @param  {[type]} mediaURL [description]
 * @return {[type]}          [description]
 */
function getUploadedMediaType(mediaURL) {
  var fileExt = checkForFileExt(mediaURL);
  if (mediaURL.slice(0,24) === 'https://www.youtube.com/') {
    buildYoutubeTile(mediaURL);
  }  else if (mediaURL.slice(0,18) === 'https://vimeo.com/') {
    buildVimeoTile(mediaURL);
  }  else if (mediaURL.slice(0, 19) === 'http://i.imgur.com/') {
    buildImgurTile(mediaURL);
  }  else if(mediaURL.slice(0,20) === 'https://i.imgur.com/') {
    buildImgurTile(mediaURL);
  }  else if (mediaURL.slice(0, 17) === 'http://imgur.com/' ||
    mediaURL.slice(0, 18) === 'https://imgur.com/') {
    buildImgurTile(mediaURL);
  }  else if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'bmp') {
    getUrlAndAddImgToGrid(mediaURL);
  }  else if (fileExt === 'gif') {
    getUrlAndAddGifToGrid(mediaURL);
  }
}

/**
 * [registerGlobalEventHandlers description]
 * @return {[type]} [description]
 */
function registerGlobalEventHandlers() {
  updateTileCount();
  $('.fav-input').on('submit', function(event) {
    console.log('form submitted!');
    event.preventDefault();
    var mediaURL = $('#url-input').val();
    var comment = $('#comment-input').val();
    getUploadedMediaType(mediaURL);
    postFav(mediaURL, comment);
  });
}

/**
 * [$ description]
 * @param  {[type]} document [description]
 * @return {[type]}          [description]
 */
$(document).ready(function() {
  registerGlobalEventHandlers();
  $('.popup-with-form').magnificPopup({
    type: 'inline',
    preloader: false,
    focus: '#username-entry',
  });
  getFavs();
});
