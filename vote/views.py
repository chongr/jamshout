from vote.models import Vote
from vote.serializers import VoteSerializer
from rest_framework import generics


class VoteCreate(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer


class VotesCurrentUser(generics.ListAPIView):
    serializer_class = VoteSerializer

    def get_queryset(self):
        user = self.request.user
        return Vote.objects.filter(user=user)
