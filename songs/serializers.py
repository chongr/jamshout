from rest_framework import serializers
from songs.models import Song


class SongSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()
    artist = serializers.SerializerMethodField()
    class Meta:
        model = Song
        fields = ('song_url', 'song_name', 'vote_count', 'id', 'artist')

    def get_vote_count(self, obj):
        return obj.votes.count()

    def get_artist(self, obj):
        return obj.artist.artist_name
