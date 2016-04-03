from songs.models import Song
from songs.serializers import SongSerializer
from rest_framework import generics

class SongList(generics.ListCreateAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer

class SongDetail(generics.RetrieveAPIView):
    queryset = Song.objects.all()
    serializer_class = SongSerializer
