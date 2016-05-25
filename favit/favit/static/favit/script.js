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
    return tileElement;
}

function createImgurTileElement(url) {
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
    return tileElement;
}

// function createWebmTileElement(url) {
//     var webmName = url.slice(-12, -5);
//     var thumbnailUrl = ('http://i.imgur.com/' + webmName + 'b' + '.jpg');
//     var imageElement = $('<img></img>').attr('src', thumbnailUrl);
//     var webmSourceElement = $('<source></source>').attr('src', url).attr(
//         'type', 'video/webm');
//     var mp4SourceElement = $('<source></source>').attr('src', url).attr(
//         'type', 'video/mp4');
//     var webmElement =  $('<video></video>').attr('autoplay', 'autoplay').attr(
//         'loop', 'loop').attr('muted', 'muted').append(
//             webmSourceElement).append(mp4SourceElement);
//     var fullSizeLink = $('<a></a>').attr('href', url).append(
//         imageElement).toggleClass('popup-vimeo');
//     var tileElement = $('<div></div>').append(fullSizeLink).toggleClass('tile');
//     var paraElement = $('<p></p>').text(url);
//     var delLink = createDelLink(tileElement);
//     var flexDivElement = $('<div></div>').toggleClass('comment').append(
//         paraElement).append(delLink);
//     tileElement.append(flexDivElement);
//     return tileElement;
// }

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
    var fullSizeLink = $('<a></a>').attr('href', url).append(
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

function convertEmptyTileToYoutube(jsonDict, emptyTile){
    var youtubeTile = emptyTile;
    youtubeTile.toggleClass('yt');
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
                disableOn: 700,
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
        url: "https://vimeo.com/api/oembed.json",
        data: 'url=' + $('#url-input').val(),
        success: function(result) {
            var emptyTile = createEmptyTile();
            var vimeoTile = convertEmptyTileToVimeo(result, emptyTile);
            $('section').prepend(vimeoTile);
            updateTileCount();
            $('.popup-vimeo').magnificPopup({
                disableOn: 700,
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
