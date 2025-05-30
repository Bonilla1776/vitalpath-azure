from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import ProgressEntry
from .serializers import ProgressEntrySerializer

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        entries = ProgressEntry.objects.filter(user=request.user).order_by("-timestamp")
        serializer = ProgressEntrySerializer(entries, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProgressEntrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

