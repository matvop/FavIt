'use strict';


function createDelLink(tileElement) {
    var delLink = $('<a></a>').text('X').attr('href', '');
    delLink.on('click', function (event) {
        event.preventDefault();
        tileElement.remove('div');
        updateTileCount();
    });
    return delLink;
}

function createImgTileElement(url) {
    var imageElement = $('<img></img>').attr('src', url);
    var fullSizeLink = $('<a></a>').attr('href', url).append(
        imageElement).toggleClass('image-popup-no-margins');
    var tileElement = $('<div></div>').append(
        fullSizeLink).toggleClass('tile');
    var paraElement = $('<p></p>').text(url);
    var delLink = createDelLink(tileElement);
    var flexDivElement = $('<div></div>').toggleClass('flex').append(
        paraElement).append(delLink);
    tileElement.append(flexDivElement);
    return tileElement;
}

function createYtTileElement(url) {
    var videoName = url.slice(-11);
    var thumbnailUrl = ('http://img.youtube.com/vi/' + videoName + '/0.jpg');
    var videoThumbnailElement = $('<img></img>').attr('src', thumbnailUrl);
    var fullSizeLink = $('<a></a>').attr('href', url).append(
        videoThumbnailElement).toggleClass('popup-youtube');
    var tileElement = $('<div></div>').append(fullSizeLink).toggleClass('tile');
    var paraElement = $('<p></p>').text(url);
    var delLink = createDelLink(tileElement);
    var flexDivElement = $('<div></div>').toggleClass('flex').append(
        paraElement).append(delLink);
    tileElement.append(flexDivElement);
    return tileElement;
}

function createWebmTileElement(url) {
    var webmName = url.slice(-12, -5);
    var thumbnailUrl = ('http://i.imgur.com/' + webmName + 'b' + '.jpg');
    var videoThumbnailElement = $('<img></img>').attr('src', thumbnailUrl);
    var webmSourceElement = $('<source></source>').attr('src', url).attr(
        'type', 'video/webm');
    var mp4SourceElement = $('<source></source>').attr('src', url).attr(
        'type', 'video/mp4');
    var webmElement =  $('<video></video>').attr('autoplay', 'autoplay').attr(
        'loop', 'loop').attr('muted', 'muted').append(
            webmSourceElement).append(mp4SourceElement);
    var fullSizeLink = $('<a></a>').attr('href', url).append(
        videoThumbnailElement).toggleClass('popup-vimeo');
    var tileElement = $('<div></div>').append(fullSizeLink).toggleClass('tile');
    var paraElement = $('<p></p>').text(url);
    var delLink = createDelLink(tileElement);
    var flexDivElement = $('<div></div>').toggleClass('flex').append(
        paraElement).append(delLink);
    tileElement.append(flexDivElement);
    return tileElement;
}

function createGifTileElement(url) {
    var imageElement = $('<img></img>').attr('src', url);
    imageElement.toggleClass('gif');
    var fullSizeLink = $('<a></a>').attr('href', url).append(
        imageElement).toggleClass('image-popup-no-margins');
    var tileElement = $('<div></div>').append(
        fullSizeLink).toggleClass('tile');
    var paraElement = $('<p></p>').text(url);
    var delLink = createDelLink(tileElement);
    var flexDivElement = $('<div></div>').toggleClass('flex').append(
        paraElement).append(delLink);
    tileElement.append(flexDivElement);
    return tileElement;
}

function getUrlAndAddImgToGrid(imgURL) {
    var tileElement = createImgTileElement(imgURL);
    return $('section').prepend(tileElement);
}

function getUrlAndAddYtToGrid(ytURL) {
    var tileElement = createYtTileElement(ytURL);
    return $('section').prepend(tileElement);
}

function getUrlAndAddWebmToGrid(webmURL) {
    var tileElement = createWebmTileElement(webmURL);
    return $('section').prepend(tileElement);
}

function getUrlAndAddGifToGrid(gifURL) {
    var tileElement = createGifTileElement(gifURL);
    return $('section').prepend(tileElement);
}

function updateTileCount() {
    var tileCount = $('.tile').length;
    return $('.dynamic').text('Media tiles in your gallery: ' + tileCount);
}

function checkForFileExt(url) {
    if (url.charAt(url.length - 4) === '.') {
        var fileExt = url.slice(-3);
    }
    else if (url.charAt(url.length - 5) === '.') {
        var fileExt = url.slice(-4);
    }
    return fileExt;
}

function getMediaURL() {
    return $('#url-input').val();
}

function normalizeYTURL(url) {
    return url.slice(0,24);
}

function getUploadedMediaType() {
    var mediaURL = getMediaURL();
    var ytURL = normalizeYTURL(mediaURL);
    var fileExt = checkForFileExt(mediaURL);
    if (ytURL === 'https://www.youtube.com/') {
        getUrlAndAddYtToGrid(mediaURL);
    }
    else if (fileExt === 'jpg' || fileExt === 'png' || fileExt === 'bmp' ) {
        getUrlAndAddImgToGrid(mediaURL);
    }
    else if (fileExt === 'webm') {
        getUrlAndAddWebmToGrid(mediaURL);
    }
    else if (fileExt === 'gif') {
        getUrlAndAddGifToGrid(mediaURL);
    }
    //add function that inserts an error image into the fav if it can't be identified
}

function registerGlobalEventHandlers() {
    updateTileCount();
    $('form').on('submit', function (event) {
        event.preventDefault();
        getUploadedMediaType(); //added to test mediaURL
        updateTileCount();
        $('form').children('#url-input').val('');
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
        $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
            disableOn: 700,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    });
}

function setFocusToTextBox(){
    document.getElementById('url-input').focus();
}


$(document).ready(function () {
    registerGlobalEventHandlers();
    setFocusToTextBox();
});
$(document).scroll(function() {
    if ($('.gif').visible() === true) {
        $('.gif').gifplayer('play');
        console.log('played gif');
    }
    else if ($('.gif').visible() === false) {
        $('.gif').gifplayer('stop');
        console.log('stopped gif');
    }
});
