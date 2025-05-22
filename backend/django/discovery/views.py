# backend/django/discovery/views.py - UPDATED
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import DiscoveryData
from .serializers import DiscoveryDataSerializer

class DiscoveryDataView(generics.CreateAPIView):
    serializer_class = DiscoveryDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Save discovery data linked to the authenticated user
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Check if user already has discovery data
        if DiscoveryData.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Discovery data already exists. Use PUT to update."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

class DiscoveryDataDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = DiscoveryDataSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return DiscoveryData.objects.get(user=self.request.user)
