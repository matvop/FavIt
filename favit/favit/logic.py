from . import models
from django.contrib.auth.models import User


def get_recent_favs():
    return models.Fav.objects.all()[0:10]

def get_all_favs_for_user(user):
    return models.Fav.objects.all().filter(user=user).values()

def save_fav(url, comment):
    new_fav = models.Fav(media_url=media_url, comment=comment)
    new_fav.save()

def register_user(user_name, email, password):
    user = User.objects.create_user(user_name, email, password)
    user.save()
