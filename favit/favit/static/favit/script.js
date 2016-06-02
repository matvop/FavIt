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
    $('.fav-input').children('#url-input').val('');
    $('.fav-input').children('#comment-input').val('');
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

function convertEmptyTileToImgurGal(jsonDict, emptyTile) {
    console.log('gallery');
    console.log('link: ' + jsonDict['data']['link']);
    console.log('id: ' + jsonDict['data']['id']);
    console.log('title: ' + jsonDict['data']['title']);
    console.dir(jsonDict);
    var imgurTile = emptyTile;
    imgurTile.toggleClass('imgur');
    if (jsonDict['data']['animated'] === true) {
        imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
            'href', jsonDict['data']['link'].replace(
                jsonDict['data']['link'].slice(
                -5), jsonDict['data']['link'].slice(-4)));
        imgurTile.find('img').attr('src', jsonDict['data']['link']);
        imgurTile.find('.author').text('Animated GIF').attr('href', 'https://imgur.com/gallery/' + jsonDict['data']['id']);
    }
    else {
        imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
            'href', jsonDict['data']['link']);
        imgurTile.find('img').attr('src', jsonDict['data']['link'].replace(
            jsonDict['data']['link'].slice(
            -4), 'm' + jsonDict['data']['link'].slice(-4)));
        imgurTile.find('.author').text('Image').attr('href', 'https://imgur.com/gallery/' + jsonDict['data']['id']);
    }
    imgurTile.find('.title').text(jsonDict['data']['title']);
    imgurTile.find('.publisher').text('Imgur').attr(
        'href', 'https://imgur.com/');
    return imgurTile;
}

function convertEmptyTileToImgurAlb(jsonDict, emptyTile) {
    console.log('album');
    console.log('link: ' + jsonDict['data']['link']);
    console.log('id: ' + jsonDict['data']['id']);
    console.log('title: ' + jsonDict['data']['title']);
    console.dir(jsonDict);
    var imgurTile = emptyTile;
    imgurTile.toggleClass('imgur');
    imgurTile.find('.title').text(jsonDict['data']['title']);
    if (jsonDict['data']['images'][0]['animated'] === true) {
        var linkID = jsonDict['data']['images'][0]['link'].replace(
            'http://i.imgur.com/', '').replace(jsonDict['data']['images'][0]['link'].slice(-4), '');
    }
    else {
        var linkID = jsonDict['data']['images'][0]['link'].replace(
            'http://i.imgur.com/', '').replace(jsonDict['data']['images'][0]['link'].slice(-4), '');
    }
    if (linkID.length > 7) {
        console.log('detected ID longer than 7');
        imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
            'href', jsonDict['data']['images'][0]['link'].replace(
            jsonDict['data']['images'][0]['link'].slice(
            -5), jsonDict['data']['images'][0]['link'].slice(-4))
        );
        imgurTile.find('img').attr('src', jsonDict['data']['images'][0]['link'].replace(
            jsonDict['data']['images'][0]['link'].slice(
            -5), 'm' + jsonDict['data']['images'][0]['link'].slice(-4))
        );
    }
    else {
        console.log('detected normal 5-7 char ID');
        imgurTile.find('.top-cont > a').toggleClass('image-popup-no-margins').attr(
            'href', jsonDict['data']['images'][0]['link']
        );
        imgurTile.find('img').attr('src', jsonDict['data']['images'][0]['link'].replace(
            jsonDict['data']['images'][0]['link'].slice(
            -4), 'm' + jsonDict['data']['images'][0]['link'].slice(-4))
        );
    }
    if (jsonDict['data']['images'][0]['animated'] === true) {
        imgurTile.find('.author').text('Animated Album').attr('href', jsonDict['data']['link']);
    }
    else {
        imgurTile.find('.author').text('Album').attr('href', jsonDict['data']['link']);
    }
    imgurTile.find('.publisher').text('Imgur').attr('href', 'https://imgur.com/');
    return imgurTile;
}

function buildImgurTile(mediaURL) {
    // if method === 'http_image' {
    //
    // }
    // else if method === 'https_image' {
    //
    // }
    // if (mediaURL.slice(0,19) === 'http://i.imgur.com/') {
    //     var id = mediaURL.replace('http://i.imgur.com/', '').replace(
    //         mediaURL.slice(-4), '')
    //             console.log('non https: ' + id);
    // }
    // else if (mediaURL.slice(0,20) === 'https://i.imgur.com/') {
    //     var id = mediaURL.replace('https://i.imgur.com/', '').replace(
    //         mediaURL.slice(-4), '')
    //             console.log('https: ' + id);
    // }
    if (mediaURL.slice(0,18) === 'http://imgur.com/g') {
        var id = mediaURL.replace('http://imgur.com/gallery/', '');
            console.log('non https: ' + id);
    }
    else if (mediaURL.slice(0,19) === 'https://imgur.com/g') {
        var id = mediaURL.replace('https://imgur.com/gallery/', '');
            console.log('https: ' + id);
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
    }
    else if (id.length === 5) { //for image albums
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

function buildYoutubeTile(mediaURL) {
    $.ajax({
        dataType: 'json',
        url: "https://noembed.com/embed",
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

function buildVimeoTile(mediaURL) {
    $.ajax({
        dataType: 'json',
        url: "https://noembed.com/embed",
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

function getUploadedMediaType(mediaURL) {
    var fileExt = checkForFileExt(mediaURL);
    if (mediaURL.slice(0,24) === 'https://www.youtube.com/') {
        buildYoutubeTile(mediaURL);
    }
    else if (mediaURL.slice(0,18) === 'https://vimeo.com/') {
        buildVimeoTile(mediaURL);
    }
    else if (mediaURL.slice(0, 19) === 'http://i.imgur.com/') {
        buildImgurTile(mediaURL);
    }
    else if(mediaURL.slice(0,20) === 'https://i.imgur.com/') {
        buildImgurTile(mediaURL);
    }
    else if (mediaURL.slice(0, 17) === 'http://imgur.com/'
        || mediaURL.slice(0, 18) === 'https://imgur.com/') {
        buildImgurTile(mediaURL);
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

function postFav(mediaURL, comment) {
    console.log("create post is working!") // sanity check
    $.ajax({
        url : "create_fav/", // the endpoint
        type : "POST", // http method
        data : {
            url_text : mediaURL,
            comment_text: comment,
        }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            console.log(json); // log the returned json to the console
            console.log("success"); // another sanity check
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
    console.log(mediaURL);
    console.log($('#comment-input').val());
}

function loadFavs(jsonDict) {
    for (var i = 0; i < jsonDict['fav_list'].length; i++) {
        console.log(jsonDict['fav_list'][i]);
        var mediaURL = jsonDict['fav_list'][i]['media_url'];
        console.log(mediaURL);
        getUploadedMediaType(mediaURL);
    }
}

function getFavs() {
    console.log("get favs is working!") // sanity check
    $.ajax({
        url : "get_favs/", // the endpoint
        type : "GET", // http method
        // handle a successful response
        success : function(result) {
            console.log(result); // log the returned json to the console
            console.log("success"); // another sanity check
            loadFavs(result);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
}

function registerGlobalEventHandlers() {
    updateTileCount();
    $('.fav-input').on('submit', function (event) {
        console.log("form submitted!");
        event.preventDefault();
        var mediaURL = $('#url-input').val();
        var comment = $('#comment-input').val();
        getUploadedMediaType(mediaURL);
        postFav(mediaURL, comment);
    });
}



$(document).ready(function () {
    registerGlobalEventHandlers();
    $('.popup-with-form').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#username-entry',
	});
    getFavs();
});


$(function() {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
