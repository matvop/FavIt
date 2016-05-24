from django.shortcuts import render
from django.utils import timezone
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from . import settings
from django.contrib.auth.decorators import login_required
from . import models
from . import logic


def render_login(request):
    next = request.GET.get('next', '/')
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        print(username)
        print(password)
        user = authenticate(username=username, password=password)
        print(user)
        if user is not None:
            if user.is_active:
                login(request, user)
                return HttpResponseRedirect(next)
            else:
                return HttpResponse("Inactive User.")
        else:
            return HttpResponseRedirect(settings.LOGIN_URL)
    return render(request, 'flutter/login.html', {'redirect_to': next})

def render_index(request):
    return render(request, 'favit/home.html')
