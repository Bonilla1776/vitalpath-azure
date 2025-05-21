from rest_framework import serializers
from .models import ProgressEntry

class ProgressEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressEntry
        fields = [
            "id",
            "timestamp",
            "fulfillment",
            "happiness",
            "energy",
            "stress",
            "sleep",
            "activity",
            "nutrition",
            "purpose",
            "motivation",
            "confidence",
        ]

