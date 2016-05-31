from django.db import models
from django.contrib.auth.models import User
import uuid


class Fav(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    media_url = models.URLField(
        max_length=400,
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
        return '{} {} {} {}'.format(
            self.user.username,
            self.datetime,
            self.comment,
            self.media_url,
        )

    def __repr__(self):
        return 'user={!r} datetime={!r} comment={!r}'.format(
            self.user.username,
            self.datetime,
            self.comment,
            self.media_url,
        )

    class Meta:
        ordering = ('-datetime',)
