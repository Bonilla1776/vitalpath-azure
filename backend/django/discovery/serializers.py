# backend/django/discovery/serializers.py - UPDATED
from rest_framework import serializers
from .models import DiscoveryData

class DiscoveryDataSerializer(serializers.ModelSerializer):
    bmi = serializers.ReadOnlyField()
    height_total_inches = serializers.ReadOnlyField()
    
    class Meta:
        model = DiscoveryData
        fields = [
            # Basic Information
            'preferred_name', 'age', 'gender', 'height_feet', 'height_inches', 
            'weight', 'location', 'marital_status',
            
            # Health Goals
            'goal_1', 'goal_2', 'goal_3',
            
            # Baseline Indicators
            'baseline_fulfillment', 'baseline_happiness', 'baseline_energy',
            'baseline_stress', 'baseline_sleep', 'baseline_activity', 
            'baseline_nutrition', 'baseline_purpose', 'baseline_motivation', 
            'baseline_confidence',
            
            # Computed fields
            'bmi', 'height_total_inches',
            
            # Timestamps
            'submitted_at', 'updated_at'
        ]
        read_only_fields = ['submitted_at', 'updated_at', 'bmi', 'height_total_inches']