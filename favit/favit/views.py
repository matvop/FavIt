from django.shortcuts import render
from django.utils import timezone
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from . import settings
from django.contrib.auth.decorators import login_required
from . import models
from . import logic


def render_profile(request):
    profile = logic.get_playlist_by_id(playlist_id)
    songs = logic.get_all_songs_for_playlist(playlist)

    template_args = {
        'playlist': playlist,
        'songs': songs,
    }
    return render(request, 'favit/profile.html', template_args)

def render_login(request):
    next = request.GET.get('next', '/user/profile.html')
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(next)
            else:
                return HttpResponse("Inactive User.")
        else:
            return HttpResponseRedirect(settings.LOGIN_URL)
    return render(request, 'favit/login.html', {'redirect_to': next})

def render_logout(request):
    logout(request)
    return HttpResponseRedirect(settings.LOGIN_URL)

def render_index(request):
    return render(request, 'favit/home.html')
