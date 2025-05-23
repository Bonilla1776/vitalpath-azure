# backend/django/discovery/models.py - ENHANCED RESEARCH-GRADE VERSION
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
import uuid
from datetime import datetime

class DiscoveryData(models.Model):
    """
    Enhanced discovery data model with completion metrics for research analysis.
    Captures comprehensive user onboarding data with research-grade validation.
    """
    
    # Research Identifiers
    id = models.BigAutoField(primary_key=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True, 
                           help_text=_("Public UUID for secure API references"))
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                               related_name='discovery_profile')
    
    # Part 1: Demographics & Basic Information
    preferred_name = models.CharField(
        max_length=100, 
        verbose_name=_("Preferred Name"),
        help_text=_("How the user prefers to be addressed")
    )
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(18), MaxValueValidator(100)],
        verbose_name=_("Age"),
        help_text=_("User's age in years")
    )
    
    class GenderChoices(models.TextChoices):
        MALE = 'male', _('Male')
        FEMALE = 'female', _('Female')
        NON_BINARY = 'non-binary', _('Non-binary')
        PREFER_NOT_TO_SAY = 'prefer-not-to-say', _('Prefer not to say')
    
    gender = models.CharField(
        max_length=20, 
        choices=GenderChoices.choices,
        verbose_name=_("Gender Identity")
    )
    
    # Physical Characteristics
    height_feet = models.PositiveIntegerField(
        validators=[MinValueValidator(3), MaxValueValidator(8)],
        verbose_name=_("Height (Feet)")
    )
    height_inches = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(11)],
        verbose_name=_("Height (Inches)")
    )
    weight = models.PositiveIntegerField(
        validators=[MinValueValidator(70), MaxValueValidator(500)],
        verbose_name=_("Weight (lbs)"),
        help_text=_("Weight in pounds")
    )
    
    # Location & Demographics
    location = models.CharField(
        max_length=100,
        verbose_name=_("Location"),
        help_text=_("City, State, or general location")
    )
    
    class MaritalStatusChoices(models.TextChoices):
        SINGLE = 'single', _('Single')
        MARRIED = 'married', _('Married')
        DIVORCED = 'divorced', _('Divorced')
        WIDOWED = 'widowed', _('Widowed')
        SEPARATED = 'separated', _('Separated')
        IN_RELATIONSHIP = 'in-relationship', _('In a Relationship')
        PREFER_NOT_TO_SAY = 'prefer-not-to-say', _('Prefer not to say')
        
    marital_status = models.CharField(
        max_length=20, 
        choices=MaritalStatusChoices.choices,
        blank=True,
        verbose_name=_("Relationship Status")
    )
    
    # Part 2: Health Goals (Research Categories)
    # Primary goals in priority order
    goal_1 = models.CharField(
        max_length=200,
        verbose_name=_("Primary Health Goal"),
        help_text=_("User's top priority health goal")
    )
    goal_2 = models.CharField(
        max_length=200, 
        blank=True,
        verbose_name=_("Secondary Health Goal")
    )
    goal_3 = models.CharField(
        max_length=200, 
        blank=True,
        verbose_name=_("Tertiary Health Goal")
    )
    
    # Part 3: Baseline Wellness Indicators (0-100 scale)
    # Psychological Well-being
    baseline_fulfillment = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Life Fulfillment"),
        help_text=_("Overall satisfaction with life achievements and direction")
    )
    baseline_happiness = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Subjective Well-being"),
        help_text=_("General emotional state and life satisfaction")
    )
    
    # Physical Well-being
    baseline_energy = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Energy Vitality"),
        help_text=_("Physical and mental energy levels throughout the day")
    )
    baseline_sleep = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Sleep Quality"),
        help_text=_("Quality and restorative nature of sleep")
    )
    baseline_activity = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Physical Activity"),
        help_text=_("Regular physical exercise and movement")
    )
    baseline_nutrition = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Nutritional Wellness"),
        help_text=_("Quality and balance of dietary choices")
    )
    
    # Mental Health
    baseline_stress = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Stress Resilience"),
        help_text=_("Ability to cope with and recover from stressful situations")
    )
    
    # Existential Well-being
    baseline_purpose = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Sense of Purpose"),
        help_text=_("Clarity about life meaning and direction")
    )
    
    # Behavioral Readiness
    baseline_motivation = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Change Motivation"),
        help_text=_("Readiness and desire for positive lifestyle changes")
    )
    baseline_confidence = models.IntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Baseline Self-Efficacy"),
        help_text=_("Belief in ability to successfully make and maintain changes")
    )
    
    # 🔬 RESEARCH COMPLETION METRICS
    duration_minutes = models.PositiveIntegerField(
        null=True, blank=True,
        verbose_name=_("Completion Time (Minutes)"),
        help_text=_("Time taken to complete the discovery assessment")
    )
    sections_completed = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(3)],
        verbose_name=_("Sections Completed"),
        help_text=_("Number of assessment sections completed")
    )
    goals_selected = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(3)],
        verbose_name=_("Goals Selected"),
        help_text=_("Number of health goals selected by user")
    )
    avg_wellness_score = models.PositiveIntegerField(
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name=_("Average Wellness Score"),
        help_text=_("Average of all baseline wellness indicators")
    )
    
    # Engagement Quality Metrics
    form_interactions = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Form Interactions"),
        help_text=_("Number of form field interactions during completion")
    )
    page_revisits = models.PositiveIntegerField(
        default=0,
        verbose_name=_("Page Revisits"),
        help_text=_("Number of times user went back to previous sections")
    )
    saved_progress = models.BooleanField(
        default=False,
        verbose_name=_("Progress Saved"),
        help_text=_("Whether user's progress was auto-saved during completion")
    )
    
    # Completion Context
    completion_device_type = models.CharField(
        max_length=50,
        blank=True,
        verbose_name=_("Completion Device"),
        help_text=_("Type of device used to complete assessment")
    )
    completion_browser = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_("Completion Browser"),
        help_text=_("Browser used to complete assessment")
    )
    
    # Research Quality Indicators
    completion_quality_score = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)],
        verbose_name=_("Completion Quality Score"),
        help_text=_("Calculated quality score based on response patterns (0.0-1.0)")
    )
    
    # Timestamps with timezone awareness
    submitted_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Submitted At"),
        help_text=_("When the discovery assessment was first submitted")
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Last Updated"),
        help_text=_("When the discovery data was last modified")
    )
    
    # Research Data Integrity
    data_version = models.CharField(
        max_length=10,
        default='1.0',
        verbose_name=_("Data Schema Version"),
        help_text=_("Version of the data collection schema used")
    )
    
    class Meta:
        verbose_name = _("Discovery Assessment")
        verbose_name_plural = _("Discovery Assessments")
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['submitted_at']),
            models.Index(fields=['uuid']),
            models.Index(fields=['user']),
            models.Index(fields=['completion_quality_score']),
            models.Index(fields=['duration_minutes']),
        ]
    
    def __str__(self):
        return f"{self.preferred_name} ({self.user.email}) - Discovery Assessment"
    
    @property
    def height_total_inches(self):
        """Convert height to total inches for calculations"""
        return (self.height_feet * 12) + self.height_inches
    
    @property
    def height_cm(self):
        """Height in centimeters"""
        return round(self.height_total_inches * 2.54, 1)
    
    @property
    def weight_kg(self):
        """Weight in kilograms"""
        return round(self.weight * 0.453592, 1)
    
    @property
    def bmi(self):
        """Calculate BMI"""
        height_in_meters = self.height_total_inches * 0.0254
        weight_in_kg = self.weight * 0.453592
        return round(weight_in_kg / (height_in_meters ** 2), 1)
    
    @property
    def bmi_category(self):
        """BMI category classification"""
        bmi = self.bmi
        if bmi < 18.5:
            return "Underweight"
        elif bmi < 25:
            return "Normal weight"
        elif bmi < 30:
            return "Overweight"
        else:
            return "Obese"
    
    @property
    def baseline_wellness_summary(self):
        """Summary of baseline wellness scores by category"""
        return {
            'psychological': round((self.baseline_fulfillment + self.baseline_happiness) / 2, 1),
            'physical': round((self.baseline_energy + self.baseline_sleep + 
                            self.baseline_activity + self.baseline_nutrition) / 4, 1),
            'mental_health': self.baseline_stress,
            'existential': self.baseline_purpose,
            'behavioral_readiness': round((self.baseline_motivation + self.baseline_confidence) / 2, 1),
            'overall_average': round((
                self.baseline_fulfillment + self.baseline_happiness + self.baseline_energy +
                self.baseline_stress + self.baseline_sleep + self.baseline_activity +
                self.baseline_nutrition + self.baseline_purpose + self.baseline_motivation +
                self.baseline_confidence
            ) / 10, 1)
        }
    
    @property
    def goals_list(self):
        """Return list of goals in priority order"""
        goals = []
        if self.goal_1:
            goals.append(self.goal_1)
        if self.goal_2:
            goals.append(self.goal_2)
        if self.goal_3:
            goals.append(self.goal_3)
        return goals
    
    @property
    def completion_rate(self):
        """Calculate completion rate as percentage"""
        if self.sections_completed:
            return round((self.sections_completed / 3) * 100, 1)
        return 0.0
    
    def calculate_completion_quality(self):
        """
        Calculate and store completion quality score based on various factors.
        Research-grade metric for data quality assessment.
        """
        quality_factors = []
        
        # Time factor (optimal range: 10-30 minutes)
        if self.duration_minutes:
            if 10 <= self.duration_minutes <= 30:
                quality_factors.append(1.0)
            elif self.duration_minutes < 5:  # Too fast, possibly rushed
                quality_factors.append(0.3)
            elif self.duration_minutes > 60:  # Too slow, possibly distracted
                quality_factors.append(0.6)
            else:
                quality_factors.append(0.8)
        
        # Completeness factor
        completeness = self.sections_completed / 3
        quality_factors.append(completeness)
        
        # Response variance (avoid straight-line responses)
        baseline_scores = [
            self.baseline_fulfillment, self.baseline_happiness, self.baseline_energy,
            self.baseline_stress, self.baseline_sleep, self.baseline_activity,
            self.baseline_nutrition, self.baseline_purpose, self.baseline_motivation,
            self.baseline_confidence
        ]
        
        if baseline_scores:
            variance_factor = 1.0
            # Check for suspicious patterns (all same values)
            if len(set(baseline_scores)) == 1:
                variance_factor = 0.2  # Very low quality if all identical
            elif len(set(baseline_scores)) <= 3:
                variance_factor = 0.5  # Medium quality if very low variance
            
            quality_factors.append(variance_factor)
        
        # Goal selection quality
        goal_quality = min(self.goals_selected / 3, 1.0) if self.goals_selected else 0
        quality_factors.append(goal_quality)
        
        # Calculate weighted average
        self.completion_quality_score = sum(quality_factors) / len(quality_factors) if quality_factors else 0.0
        return self.completion_quality_score
    
    def save(self, *args, **kwargs):
        # Calculate derived metrics before saving
        if not self.avg_wellness_score:
            baseline_scores = [
                self.baseline_fulfillment, self.baseline_happiness, self.baseline_energy,
                self.baseline_stress, self.baseline_sleep, self.baseline_activity,
                self.baseline_nutrition, self.baseline_purpose, self.baseline_motivation,
                self.baseline_confidence
            ]
            self.avg_wellness_score = round(sum(baseline_scores) / len(baseline_scores))
        
        # Calculate completion quality score
        if not self.completion_quality_score:
            self.calculate_completion_quality()
        
        super().save(*args, **kwargs)


class DiscoverySession(models.Model):
    """
    Track discovery assessment sessions for research analysis.
    Captures user journey and interaction patterns.
    """
    
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                            related_name='discovery_sessions')
    discovery_data = models.ForeignKey(DiscoveryData, on_delete=models.CASCADE,
                                     null=True, blank=True, related_name='sessions')
    
    # Session tracking
    session_start = models.DateTimeField(auto_now_add=True)
    session_end = models.DateTimeField(null=True, blank=True)
    last_active_section = models.PositiveIntegerField(default=1)
    is_completed = models.BooleanField(default=False)
    
    # Interaction metrics
    section_1_time = models.PositiveIntegerField(null=True, blank=True,
                                               help_text=_("Time spent on section 1 (seconds)"))
    section_2_time = models.PositiveIntegerField(null=True, blank=True,
                                               help_text=_("Time spent on section 2 (seconds)"))
    section_3_time = models.PositiveIntegerField(null=True, blank=True,
                                               help_text=_("Time spent on section 3 (seconds)"))
    
    # Technical context
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    screen_resolution = models.CharField(max_length=20, blank=True)
    
    class Meta:
        verbose_name = _("Discovery Session")
        verbose_name_plural = _("Discovery Sessions")
        ordering = ['-session_start']
        indexes = [
            models.Index(fields=['user', 'session_start']),
            models.Index(fields=['is_completed']),
        ]
    
    def __str__(self):
        status = "Completed" if self.is_completed else f"Section {self.last_active_section}"
        return f"{self.user.email} - Discovery Session ({status})"
    
    @property
    def total_duration_minutes(self):
        """Total session duration in minutes"""
        if self.session_end:
            duration = self.session_end - self.session_start
            return round(duration.total_seconds() / 60, 1)
        return None
    
    def mark_completed(self):
        """Mark session as completed"""
        self.is_completed = True
        self.session_end = datetime.now()
        self.save()