from rest_framework import generics, permissions
from .models import DiscoveryData
from .serializers import DiscoveryDataSerializer

class DiscoveryDataView(generics.CreateAPIView):
    serializer_class = DiscoveryDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
