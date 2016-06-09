"""Render HTML documents and handle Post/Get requests from clients."""
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render

from . import logic


def create_fav(request):
    """Fav post from user saved into the database if valid."""
    if request.method == 'POST':
        url_text = request.POST.get('url_text')
        comment_text = request.POST.get('comment_text')
        response_data = {}
        if url_text[0:4] != 'http':
            response_data['result'] = 'Error - Failed to create Fav!'
            return JsonResponse(response_data, status=500)
        else:
            fav = logic.save_fav(url_text, comment_text, request.user)
            response_data['result'] = 'Created fav successfully!'
            response_data['user'] = fav.user.username
            response_data['media_url'] = fav.media_url
            response_data['comment'] = fav.comment
            response_data['created-on'] = fav.datetime.strftime(
                '%B %d, %Y %I:%M %p')
            return JsonResponse(response_data, status=200)
    else:
        response_data['result'] = 'Error - Failed to create Fav!'
        return JsonResponse(response_data, status=500)


def get_all_favs_from_database(request):
    """Retrieve all Favs and send them to the client."""
    if request.method == 'GET':
        response_data = {'fav_list': []}
        favs = logic.get_all_favs()
        for fav in favs:
            response_data['fav_list'].append({
                'user': fav.user.username,
                'media_url': fav.media_url,
                'comment': fav.comment,
                'created': fav.datetime.strftime('%B %d, %Y %I:%M %p')
                })
        response_data['result'] = 'Successfully retrieved Fav data.'
        return JsonResponse(response_data, status=200)
    else:
        response_data['result'] = 'Error - Failed to retrieve Fav data.'
        return JsonResponse(response_data, status=500)


def get_favs(request):
    """Retrieve the all Favs and send them to the client."""
    if request.method == 'GET':
        response_data = {'fav_list': []}
        if request.user.is_authenticated() is True:
            favs = logic.get_all_favs_for_user(request.user)
        else:
            favs = logic.get_all_favs()
        for fav in favs:
            response_data['fav_list'].append({
                'user': fav.user.username,
                'media_url': fav.media_url,
                'comment': fav.comment,
                'created': fav.datetime.strftime('%B %d, %Y %I:%M %p')
                })
        response_data['result'] = 'Successfully retrieved Fav data.'
        return JsonResponse(response_data, status=200)
    else:
        response_data['result'] = 'Error - Failed to retrieve Fav data.'
        return JsonResponse(response_data, status=500)


def post_register(request):
    """Post username and password for new user."""
    """Saves them into the User model as long as they don't already exist."""
    next = request.GET.get('next', '/')
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is None:
            logic.register_user(username, password)
            user = authenticate(username=username, password=password)
            login(request, user)
            logic.get_all_favs_for_user(user)
            return HttpResponseRedirect(next)
        else:
            return HttpResponse('Inactive User.', status=403)
    else:
        return HttpResponseRedirect(next)


def post_login(request):
    """Receive login information from client and authenticate."""
    next = request.GET.get('next', '/')
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                logic.get_all_favs_for_user(user)
                return HttpResponseRedirect(next)
            else:
                return HttpResponse('Inactive User.', status=403)
        else:
            return HttpResponse(
                '<div style=''font-family:monospace;font-size:2.0em;color:red;'
                '>Invalid Username/Password.</div><br><a style='
                'color:black;font-family:monospace;'' href=''/'
                '>Back Home</a>', status=401)
    else:
        return HttpResponseRedirect(next)


def logout_user(request):
    """Log the user out."""
    next = request.GET.get('next', '/')
    logout(request)
    return HttpResponseRedirect(next)


def render_index(request):
    """Render the home page/index."""
    return render(request, 'favit/home.html', {})
