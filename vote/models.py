from __future__ import unicode_literals

from django.db import models
from model_utils.models import TimeStampedModel

# Create your models here.

class Vote(TimeStampedModel):
    user = models.ForeignKey('auth.User', related_name='votes')
    song = models.ForeignKey('songs.Song', related_name='votes')
