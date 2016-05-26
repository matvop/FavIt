'use strict';


function createDelLink(tileElement) {
    var delLink = $('<a></a>').text('X').attr('href', '');
    delLink.on('click', function (event) {
        event.preventDefault();
        tileElement.remove('article');
        updateTileCount();
    });
    return delLink;
}

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
    $('form').children('#url-input').val('');
    return tileElement;
}

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

function createEmptyTile() {
    var url = $('#url-input').val();
    var imageElement = $('<img></img>').attr(
        'src', "").toggleClass('thumb');
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
        'href', "").attr('target', '_blank').toggleClass('author');
    var publisher = $('<a></a>').toggleClass('publisher').attr(
        'target', '_blank');
    var seperatorAndPublisher = $('<div>&nbsp- </div>').append(
        publisher);
    var mediaSourceElement = $('<div></div>').toggleClass('source').append(
        authorLinkElement, seperatorAndPublisher);
    var flexDivElement = $('<div></div>').toggleClass('comment').append(
        commentHeaderElement, mediaSourceElement);
    tileElement.append(flexDivElement);
    return tileElement;
}

function convertEmptyTileToImgur(jsonDict, emptyTile) {
    console.log('link: ' + jsonDict['data']['link']);
    console.log('id: ' + jsonDict['data']['id']);
    console.log('title: ' + jsonDict['data']['title']);
    console.dir(jsonDict);
    var imgurTile = emptyTile;
    imgurTile.toggleClass('imgur');
    imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
        'href', jsonDict['data']['link']);
    imgurTile.find('img').attr('src', jsonDict['data']['link'].replace(
        jsonDict['data']['link'].slice(
            -4), 'm' + jsonDict['data']['link'].slice(-4)));
    imgurTile.find('.title').text(jsonDict['data']['title']);
    imgurTile.find('.publisher').text('Imgur').attr(
        'href', 'https://imgur.com/');
    return imgurTile;
}

function buildImgurTile() {
    if ($('#url-input').val().slice(0,19) === 'http://i.imgur.com/') {
        var id = $('#url-input').val().replace('http://i.imgur.com/', '').replace(
            $('#url-input').val().slice(-4), '')
                console.log('non https: ' + id);
    }
    else if ($('#url-input').val().slice(0,20) === 'https://i.imgur.com/') {
        var id = $('#url-input').val().replace('https://i.imgur.com/', '').replace(
            $('#url-input').val().slice(-4), '')
                console.log('https: ' + id);
    }
    $.ajax({
        dataType: 'json',
        url: 'https://api.imgur.com/3/image/' + id,
        headers: {Authorization: 'Client-ID 5225450d88ff546'},
        success: function(result) {
            var emptyTile = createEmptyTile();
            var imgurTile = convertEmptyTileToImgur(result, emptyTile);
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
            $('form').children('#url-input').val('');
        }
    });
}

function convertEmptyTileToYoutube(jsonDict, emptyTile) {
    var youtubeTile = emptyTile;
    youtubeTile.toggleClass('yt');
    youtubeTile.find('.top-cont > a').toggleClass(
        'popup-youtube').attr('href', jsonDict['url']);
    youtubeTile.find('img').attr('src', jsonDict['thumbnail_url']);
    youtubeTile.find('.title').text(jsonDict['title']);
    youtubeTile.find('.author').attr('href', jsonDict['author_url']).text(
        jsonDict['author_name']);
    youtubeTile.find('.publisher').text(jsonDict['provider_name']).attr(
        'href', jsonDict['provider_url']);
    return youtubeTile;
}

function buildYoutubeTile() {
    $.ajax({
        dataType: 'json',
        url: "https://noembed.com/embed",
        data: 'url=' + $('#url-input').val(),
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
            $('form').children('#url-input').val('');
        }
    });
}

function convertEmptyTileToVimeo(jsonDict, emptyTile) {
    var vimeoTile = emptyTile;
    vimeoTile.toggleClass('vim');
    vimeoTile.find('.top-cont > a').attr('href', jsonDict['url']).toggleClass(
        'popup-vimeo');
    vimeoTile.find('img').attr('src', jsonDict['thumbnail_url']);
    vimeoTile.find('.title').text(jsonDict['title']);
    vimeoTile.find('.author').attr('href', jsonDict['author_url']).text(
        jsonDict['author_name']);
    vimeoTile.find('.publisher').text(jsonDict['provider_name']).attr(
        'href', jsonDict['provider_url']);
    return vimeoTile;
}

function buildVimeoTile() {
    $.ajax({
        dataType: 'json',
        url: "https://noembed.com/embed",
        data: 'url=' + $('#url-input').val(),
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
            $('form').children('#url-input').val('');
        }
    });
}


function getUrlAndAddImgToGrid(imgURL) {
    var tileElement = createImgTileElement(imgURL);
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
    var tileCount = $('article').length;
    return $('.dynamic').text('Favs in your gallery: ' + tileCount);
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

function getUploadedMediaType() {
    var mediaURL = $('#url-input').val();;
    var fileExt = checkForFileExt(mediaURL);
    if (mediaURL.slice(0,24) === 'https://www.youtube.com/') {
        buildYoutubeTile();
    }
    else if (mediaURL.slice(0,18) === 'https://vimeo.com/') {
        buildVimeoTile();
    }
    else if (mediaURL.slice(0, 19) === 'http://i.imgur.com/'
        || mediaURL.slice(0,20) === 'https://i.imgur.com/') {
        buildImgurTile();
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
}

function registerGlobalEventHandlers() {
    updateTileCount();
    $('form').on('submit', function (event) {
        event.preventDefault();
        getUploadedMediaType();
        // $('form').children('#url-input').val('');
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
            disableOn: 0,
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
