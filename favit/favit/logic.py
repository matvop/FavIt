from . import models


def get_recent_favs():
    return models.Fav.objects.all()[0:10]

def get_all_favs_for_user(user_name):
    return models.Fav.objects.all().filter(user_name=user_name).values()

def save_fav(user_name, comment):
    new_fav = models.Fav(user_name=user_name, media_url=media_url, comment=comment)
    new_fav.save()
