from . import models
from django.contrib.auth.models import User


def get_recent_favs():
    return models.Fav.objects.all()[0:100]

def get_all_favs_for_user(user):
    return models.Fav.objects.all().filter(user=user)

def save_fav(media_url, comment, user):
    new_fav = models.Fav(media_url=media_url, comment=comment, user=user)
    new_fav.save()
    return new_fav

def register_user(user_name, email, password):
    user = User.objects.create_user(user_name, email, password)
    user.save()
