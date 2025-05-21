from rest_framework import serializers
from .models import DiscoveryData

class DiscoveryDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscoveryData
        fields = ['goal_1', 'goal_2', 'goal_3', 'submitted_at']
        read_only_fields = ['submitted_at']
