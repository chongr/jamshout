from rest_framework import serializers
from songs.models import Song

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('song_url', 'song_name')
