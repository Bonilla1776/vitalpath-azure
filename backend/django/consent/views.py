from rest_framework import generics, permissions
from .models import Consent
from .serializers import ConsentSerializer

class ConsentView(generics.CreateAPIView):
    serializer_class = ConsentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
