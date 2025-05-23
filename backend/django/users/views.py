# backend/django/users/views.py - UPDATED WITH STANDARD JWT
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = []  # No authentication required for registration

class LoginView(APIView):
    """
    Custom login view that returns JWT tokens
    Note: You can also use the standard TokenObtainPairView at /api/token/
    """
    permission_classes = []  # No authentication required for login
    
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        
        if not email or not password:
            return Response(
                {"detail": "Email and password are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(request, username=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "preferred_name": getattr(user, 'preferred_name', user.email.split('@')[0])
                }
            })
        return Response(
            {"detail": "Invalid credentials."}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)