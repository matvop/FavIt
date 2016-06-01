from django.contrib import admin

from . import models

class FavAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'media_url', 'comment', 'datetime']
    class Meta:
        model = models.Fav


admin.site.register(models.Fav, FavAdmin)
