from django.shortcuts import render
from django.utils import timezone
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from . import settings
from django.contrib.auth.decorators import login_required
from . import logic
from django.http import JsonResponse


def create_fav(request):
    if request.method == 'POST':
        url_text = request.POST.get('url_text')
        comment_text = request.POST.get('comment_text')

        response_data = {}
        fav = logic.save_fav(url_text, comment_text, request.user)

        response_data['result'] = 'Created fav successfully!'
        response_data['user'] = fav.user.username
        response_data['media_url'] = fav.media_url
        response_data['comment'] = fav.comment
        response_data['created-on'] = fav.datetime.strftime('%B %d, %Y %I:%M %p')
        return JsonResponse(response_data)
    else:
        response_data['result'] = 'Error - Failed to create Fav!'
        return JsonResponse(response_data)

def render_profile(request):
    return render(request, 'favit/profile.html', {})

def render_login(request):
    next = request.GET.get('next', '/')
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                login(request, user)
                favs = logic.get_all_favs_for_user(user)
                return HttpResponseRedirect(next)
            else:
                return HttpResponse("Inactive User.")
        else:
            return HttpResponseRedirect(settings.LOGIN_URL)

    return render(request, 'favit/login.html', {'redirect_to': next})

def render_ack(request):
    return render(request, 'favit/home.html', {})

def render_logout(request):
    next = request.GET.get('next', '/')
    logout(request)
    return HttpResponseRedirect(next)
    # return render(request, 'favit/home.html', {'redirect_to': next})

def render_index(request):
    response_data = []
    if request.user.is_authenticated() == True:
        favs = logic.get_all_favs_for_user(request.user)
    else:
        favs = logic.get_recent_favs()

    for fav in favs:
        print(fav)
        response_data.append({
            'user_id': fav.user_id,
            'media_url': media_url,
            'comment': comment,
            'created': datetime.strftime('%B %d, %Y %I:%M %p')
            })
        # response_data['user'] = fav.user.username
        # response_data['media_url'] = fav.media_url
        # response_data['comment'] = fav.comment
        # response_data['created'] = fav.datetime.strftime('%B %d, %Y %I:%M %p')
    print(response_data)

    return render(request, 'favit/home.html', {})
