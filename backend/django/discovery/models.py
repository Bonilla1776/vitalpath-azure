# backend/django/discovery/models.py - COMPLETE VERSION
from django.db import models
from django.conf import settings

class DiscoveryData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Part 1: Basic Information
    preferred_name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=20, choices=[
        ('male', 'Male'),
        ('female', 'Female'),
        ('non-binary', 'Non-binary'),  
        ('prefer-not-to-say', 'Prefer not to say')
    ])
    height_feet = models.PositiveIntegerField()
    height_inches = models.PositiveIntegerField()
    weight = models.PositiveIntegerField()  # in pounds
    location = models.CharField(max_length=100)
    marital_status = models.CharField(max_length=20, blank=True, choices=[
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
        ('separated', 'Separated'),
        ('in-relationship', 'In a Relationship'),
        ('prefer-not-to-say', 'Prefer not to say')
    ])
    
    # Part 2: Health Goals (in priority order)
    goal_1 = models.CharField(max_length=200)  # Required
    goal_2 = models.CharField(max_length=200, blank=True)
    goal_3 = models.CharField(max_length=200, blank=True)
    
    # Part 3: Baseline Wellness & Purpose Indicators (0-100 scale)
    # These become the user's baseline for tracking progress
    baseline_fulfillment = models.IntegerField(default=50)
    baseline_happiness = models.IntegerField(default=50)
    baseline_energy = models.IntegerField(default=50)
    baseline_stress = models.IntegerField(default=50)  # Higher = better stress management
    baseline_sleep = models.IntegerField(default=50)
    baseline_activity = models.IntegerField(default=50)
    baseline_nutrition = models.IntegerField(default=50)
    baseline_purpose = models.IntegerField(default=50)
    baseline_motivation = models.IntegerField(default=50)
    baseline_confidence = models.IntegerField(default=50)
    
    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.preferred_name} ({self.user.email}) - Discovery Data"
    
    @property
    def height_total_inches(self):
        """Convert height to total inches for calculations"""
        return (self.height_feet * 12) + self.height_inches
    
    @property
    def bmi(self):
        """Calculate BMI"""
        height_in_meters = self.height_total_inches * 0.0254
        weight_in_kg = self.weight * 0.453592
        return round(weight_in_kg / (height_in_meters ** 2), 1)
