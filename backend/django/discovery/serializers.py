# backend/django/discovery/serializers.py - ENHANCED RESEARCH-GRADE VERSION
from rest_framework import serializers
from .models import DiscoveryData, DiscoverySession
from django.contrib.auth import get_user_model

User = get_user_model()

class DiscoveryDataSerializer(serializers.ModelSerializer):
    """
    Enhanced serializer for discovery data with completion metrics support.
    Handles research-grade data validation and computed fields.
    """
    
    # Computed read-only fields
    bmi = serializers.ReadOnlyField()
    bmi_category = serializers.ReadOnlyField()
    height_total_inches = serializers.ReadOnlyField()
    height_cm = serializers.ReadOnlyField()
    weight_kg = serializers.ReadOnlyField()
    baseline_wellness_summary = serializers.ReadOnlyField()
    goals_list = serializers.ReadOnlyField()
    completion_rate = serializers.ReadOnlyField()
    uuid = serializers.UUIDField(read_only=True)
    
    # Completion metrics - write-once fields
    completion_metrics = serializers.JSONField(write_only=True, required=False)
    
    class Meta:
        model = DiscoveryData
        fields = [
            # Identifiers
            'uuid',
            
            # Basic Information
            'preferred_name', 'age', 'gender', 'height_feet', 'height_inches', 
            'weight', 'location', 'marital_status',
            
            # Health Goals
            'goal_1', 'goal_2', 'goal_3', 'goals_list',
            
            # Baseline Indicators
            'baseline_fulfillment', 'baseline_happiness', 'baseline_energy',
            'baseline_stress', 'baseline_sleep', 'baseline_activity', 
            'baseline_nutrition', 'baseline_purpose', 'baseline_motivation', 
            'baseline_confidence',
            
            # Computed wellness fields
            'bmi', 'bmi_category', 'height_total_inches', 'height_cm', 'weight_kg',
            'baseline_wellness_summary', 'avg_wellness_score',
            
            # Research completion metrics
            'duration_minutes', 'sections_completed', 'goals_selected',
            'completion_rate', 'form_interactions', 'page_revisits',
            'saved_progress', 'completion_device_type', 'completion_browser',
            'completion_quality_score',
            
            # Timestamps
            'submitted_at', 'updated_at', 'data_version',
            
            # Write-only completion data
            'completion_metrics'
        ]
        read_only_fields = [
            'uuid', 'submitted_at', 'updated_at', 'bmi', 'bmi_category',
            'height_total_inches', 'height_cm', 'weight_kg', 'baseline_wellness_summary',
            'goals_list', 'completion_rate', 'avg_wellness_score', 'completion_quality_score'
        ]
    
    def validate_age(self, value):
        """Validate age is within reasonable range for research"""
        if value < 18:
            raise serializers.ValidationError("Participants must be 18 or older.")
        if value > 100:
            raise serializers.ValidationError("Please enter a valid age.")
        return value
    
    def validate_weight(self, value):
        """Validate weight is within reasonable range"""
        if value < 70 or value > 500:
            raise serializers.ValidationError("Please enter a valid weight between 70-500 lbs.")
        return value
    
    def validate_preferred_name(self, value):
        """Validate preferred name meets quality standards"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        if len(value.strip()) > 100:
            raise serializers.ValidationError("Name must be less than 100 characters.")
        return value.strip()
    
    def validate_location(self, value):
        """Validate location is provided"""
        if not value.strip():
            raise serializers.ValidationError("Location is required.")
        return value.strip()
    
    def validate_goal_1(self, value):
        """Ensure primary goal is provided"""
        if not value.strip():
            raise serializers.ValidationError("At least one health goal is required.")
        return value.strip()
    
    def validate(self, attrs):
        """Cross-field validation for research data quality"""
        
        # Height validation
        height_feet = attrs.get('height_feet', 0)
        height_inches = attrs.get('height_inches', 0)
        
        if height_feet < 3 or height_feet > 8:
            raise serializers.ValidationError({
                'height_feet': 'Height must be between 3-8 feet.'
            })
        
        if height_inches < 0 or height_inches > 11:
            raise serializers.ValidationError({
                'height_inches': 'Inches must be between 0-11.'
            })
        
        # Baseline wellness validation (ensure some variance for data quality)
        baseline_fields = [
            'baseline_fulfillment', 'baseline_happiness', 'baseline_energy',
            'baseline_stress', 'baseline_sleep', 'baseline_activity',
            'baseline_nutrition', 'baseline_purpose', 'baseline_motivation',
            'baseline_confidence'
        ]
        
        baseline_values = [attrs.get(field, 50) for field in baseline_fields if field in attrs]
        
        # Check for suspicious patterns (all identical values)
        if len(baseline_values) >= 5 and len(set(baseline_values)) == 1:
            # Allow it but flag for quality review
            attrs['completion_quality_flag'] = 'identical_baseline_values'
        
        # Goal counting
        goals_count = sum(1 for goal in [attrs.get('goal_1'), attrs.get('goal_2'), attrs.get('goal_3')] 
                         if goal and goal.strip())
        attrs['goals_selected'] = goals_count
        
        return attrs
    
    def create(self, validated_data):
        """Enhanced create method with completion metrics handling"""
        
        # Extract completion metrics if provided
        completion_metrics = validated_data.pop('completion_metrics', {})
        
        # Process completion metrics
        if completion_metrics:
            validated_data.update({
                'duration_minutes': completion_metrics.get('duration_minutes'),
                'sections_completed': completion_metrics.get('sections_completed', 3),
                'form_interactions': completion_metrics.get('form_interactions', 0),
                'page_revisits': completion_metrics.get('page_revisits', 0),
                'saved_progress': completion_metrics.get('saved_progress', False),
                'completion_device_type': completion_metrics.get('device_type', ''),
                'completion_browser': completion_metrics.get('browser', ''),
            })
        
        # Create the discovery data
        discovery_data = super().create(validated_data)
        
        # Calculate and save quality metrics
        discovery_data.calculate_completion_quality()
        discovery_data.save()
        
        return discovery_data
    
    def update(self, instance, validated_data):
        """Enhanced update method"""
        
        # Extract completion metrics if provided
        completion_metrics = validated_data.pop('completion_metrics', {})
        
        # Process completion metrics for updates
        if completion_metrics:
            validated_data.update({
                'form_interactions': completion_metrics.get('form_interactions', instance.form_interactions),
                'page_revisits': completion_metrics.get('page_revisits', instance.page_revisits),
            })
        
        # Update the instance
        discovery_data = super().update(instance, validated_data)
        
        # Recalculate quality metrics
        discovery_data.calculate_completion_quality()
        discovery_data.save()
        
        return discovery_data


class DiscoverySessionSerializer(serializers.ModelSerializer):
    """
    Serializer for discovery session tracking.
    Used for research analytics and user journey analysis.
    """
    
    uuid = serializers.UUIDField(read_only=True)
    total_duration_minutes = serializers.ReadOnlyField()
    
    class Meta:
        model = DiscoverySession
        fields = [
            'uuid', 'session_start', 'session_end', 'last_active_section',
            'is_completed', 'section_1_time', 'section_2_time', 'section_3_time',
            'total_duration_minutes', 'user_agent', 'screen_resolution'
        ]
        read_only_fields = [
            'uuid', 'session_start', 'total_duration_minutes'
        ]


class DiscoveryAnalyticsSerializer(serializers.Serializer):
    """
    Serializer for discovery analytics data.
    Provides aggregated insights for research analysis.
    """
    
    total_completions = serializers.IntegerField(read_only=True)
    average_completion_time = serializers.FloatField(read_only=True)
    completion_rate = serializers.FloatField(read_only=True)
    average_quality_score = serializers.FloatField(read_only=True)
    
    # Demographics distribution
    age_distribution = serializers.DictField(read_only=True)
    gender_distribution = serializers.DictField(read_only=True)
    
    # Goals analysis
    top_goals = serializers.ListField(read_only=True)
    goals_distribution = serializers.DictField(read_only=True)
    
    # Wellness baselines
    wellness_averages = serializers.DictField(read_only=True)
    wellness_distributions = serializers.DictField(read_only=True)
    
    # Quality metrics
    quality_distribution = serializers.DictField(read_only=True)
    completion_patterns = serializers.DictField(read_only=True)


class DiscoveryDataSummarySerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for discovery data summaries.
    Used in dashboard and list views.
    """
    
    uuid = serializers.UUIDField(read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    baseline_wellness_summary = serializers.ReadOnlyField()
    goals_list = serializers.ReadOnlyField()
    completion_rate = serializers.ReadOnlyField()
    
    class Meta:
        model = DiscoveryData
        fields = [
            'uuid', 'user_email', 'preferred_name', 'age', 'gender',
            'goals_list', 'baseline_wellness_summary', 'completion_rate',
            'completion_quality_score', 'submitted_at'
        ]