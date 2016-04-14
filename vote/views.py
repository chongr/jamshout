from vote.models import Vote
from vote.serializers import VoteSerializer
from rest_framework import generics
from rest_framework import permissions
from vote.permissions import IsOwner

class VoteCreate(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer


class VoteDelete(generics.DestroyAPIView):
    queryset = Vote.objects.all()
    permission_classes = (permissions.IsAuthenticated, IsOwner)


class VotesCurrentUser(generics.ListAPIView):
    serializer_class = VoteSerializer

    def get_queryset(self):
        user = self.request.user
        return Vote.objects.filter(user=user)
