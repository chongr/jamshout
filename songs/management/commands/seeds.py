from artist.models import Artist
from songs.models import Song
from vote.models import Vote
from django.contrib.auth.models import User
from django.db import transaction

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    args = '<foo bar ...>'
    help = 'our help string comes here'

    def seed(self):

        with transaction.atomic():
            users = {
                'rod': User(first_name='Rodrigo', username='rod', password='jamshout'),

                'chongr': User(first_name='Ryan', username='ryan', password='jamshout')
            }

            for key, user in users.iteritems():
                user.save()

            artists = {
                'fetty_wap' : Artist(artist_name='Fetty Wap'),
                'tinashe' : Artist(artist_name='Tinashe')
            }

            for key, artist in artists.iteritems():
                artist.save()

            songs = {
                'trap_queen': Song(
                    song_name='Trap Queen',
                    song_url='https://soundcloud.com/harlem_fetty/fetty-wap-trap-queen-rough',
                    artist=artists['fetty_wap']
                ),
                'days_in_the_west': Song(
                    song_name='Days in the West',
                    song_url='https://soundcloud.com/tinashenow/tinashe-days-in-the-west-drake-cover',
                    artist=artists['tinashe']
                )
            }

            for key, song in songs.iteritems():
                song.save()

            voter = User.objects.first()

            votes = [
                Vote(song=songs['trap_queen'], user=voter),
                Vote(song=songs['days_in_the_west'], user=voter)
            ]

            for vote in votes:
                vote.save()

    def handle(self, *args, **options):
        self.seed()
