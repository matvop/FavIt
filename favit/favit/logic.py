"""All server-side logic is placed here."""
# from datetime import datetime, timedelta

from django.contrib.auth.models import User

from . import models


def get_all_favs():
    """Retrieve all Fav objects from the database."""
    return models.Fav.objects.all()
    # return models.Fav.objects.filter(
    #     datetime__gte=datetime.now()-timedelta(days=7)) # doesn't work


def get_all_favs_for_user(user):
    """Retrieve all fav objects for specified user from the database."""
    return models.Fav.objects.all().filter(user=user)


def save_fav(media_url, comment, user):
    """Save user's fav object into the database."""
    new_fav = models.Fav(media_url=media_url, comment=comment, user=user)
    new_fav.save()
    return new_fav


def register_user(user_name, password):
    """Register new user."""
    user = User.objects.create_user(username=user_name, password=password)
    user.save()
