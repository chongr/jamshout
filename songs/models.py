from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Song(models.Model):
    song_url = models.CharField(max_length=255)
    song_name = models.CharField(max_length=255, default = '')
    def __str__(self):
        return self.song_name + ' (' + self.song_url + ')'
