from django.shortcuts import render
from django.utils import timezone
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from . import settings
from django.contrib.auth.decorators import login_required
from . import models
from . import logic

def render_index(request):
    # flutts = logic.get_all_flutts()
    # context = {
    #     'flutts': flutts,
    # }
    return render(request, 'favit/home.html')
