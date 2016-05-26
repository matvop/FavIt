from django.db import models
from django.conf import settings


class Fav(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
    )
    media_url = models.URLField(
        max_length=200,
        blank=False
    )
    comment = models.CharField(
        max_length=400,
        blank=True,
        null=True
    )
    datetime = models.DateTimeField(
        auto_now_add=True,
        auto_now=False
    )

    def __str__(self):
        return '{} {} {}'.format(
            self.datetime,
            self.user_name,
            self.comment,
        )

    def __repr__(self):
        return 'user={!r} datetime={!r} comment={!r}'.format(
            self.user_name,
            self.datetime,
            self.comment,
        )

    class Meta:
        ordering = ('-datetime',)
