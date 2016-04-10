from rest_framework import serializers
from songs.models import Song


class SongSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()

    class Meta:
        model = Song
        fields = ('song_url', 'song_name', 'vote_count')

    def get_vote_count(self, obj):
        return obj.votes.count()
