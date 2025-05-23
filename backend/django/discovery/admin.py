# backend/django/discovery/admin.py - FIXED WITH ALL IMPORTS
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.http import HttpResponse
from django.db import models  # Add this import for the aggregate functions
from .models import DiscoveryData, DiscoverySession
import csv
from datetime import datetime
import json

# Custom admin filters for quality score and duration
class CompletionQualityFilter(admin.SimpleListFilter):
    title = 'completion quality'
    parameter_name = 'completion_quality'

    def lookups(self, request, model_admin):
        return (
            ('excellent', 'Excellent (0.8-1.0)'),
            ('good', 'Good (0.6-0.79)'),
            ('fair', 'Fair (0.4-0.59)'),
            ('poor', 'Poor (0.0-0.39)'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'excellent':
            return queryset.filter(completion_quality_score__gte=0.8)
        if self.value() == 'good':
            return queryset.filter(completion_quality_score__gte=0.6, completion_quality_score__lt=0.8)
        if self.value() == 'fair':
            return queryset.filter(completion_quality_score__gte=0.4, completion_quality_score__lt=0.6)
        if self.value() == 'poor':
            return queryset.filter(completion_quality_score__gte=0.0, completion_quality_score__lt=0.4)

class DurationFilter(admin.SimpleListFilter):
    title = 'completion duration'
    parameter_name = 'duration'

    def lookups(self, request, model_admin):
        return (
            ('fast', 'Fast (< 10 minutes)'),
            ('normal', 'Normal (10-30 minutes)'),
            ('slow', 'Slow (30-60 minutes)'),
            ('very_slow', 'Very slow (> 60 minutes)'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'fast':
            return queryset.filter(duration_minutes__lt=10)
        if self.value() == 'normal':
            return queryset.filter(duration_minutes__gte=10, duration_minutes__lte=30)
        if self.value() == 'slow':
            return queryset.filter(duration_minutes__gt=30, duration_minutes__lte=60)
        if self.value() == 'very_slow':
            return queryset.filter(duration_minutes__gt=60)

@admin.register(DiscoveryData)
class DiscoveryDataAdmin(admin.ModelAdmin):
    """Enhanced admin interface for discovery data with research analytics."""
    
    list_display = [
        'preferred_name', 'user_email', 'age', 'gender', 'completion_quality_badge',
        'duration_minutes', 'goals_selected', 'avg_wellness_score', 'submitted_at'
    ]
    
    list_filter = [
        'gender', 'marital_status', 'goals_selected', 'sections_completed',
        CompletionQualityFilter,
        DurationFilter,
        'submitted_at', 'data_version'
    ]
    
    search_fields = [
        'preferred_name', 'user__email', 'location', 'goal_1', 'goal_2', 'goal_3'
    ]
    
    readonly_fields = [
        'uuid', 'user', 'submitted_at', 'updated_at', 'completion_quality_score',
        'goals_display', 'completion_metrics_display'
    ]
    
    def user_email(self, obj):
        """Display user email with link to user admin"""
        if obj and obj.user:
            try:
                url = reverse('admin:auth_user_change', args=[obj.user.id])
                return format_html('<a href="{}">{}</a>', url, obj.user.email)
            except:
                return obj.user.email if obj.user else '-'
        return '-'
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def completion_quality_badge(self, obj):
        """Display completion quality as colored badge"""
        if not obj or obj.completion_quality_score is None:
            return format_html('<span style="color: gray;">Not Calculated</span>')
        
        score = obj.completion_quality_score
        if score >= 0.8:
            color = 'green'
            label = 'Excellent'
        elif score >= 0.6:
            color = 'orange'
            label = 'Good'
        elif score >= 0.4:
            color = 'red'
            label = 'Fair'
        else:
            color = 'darkred'
            label = 'Poor'
        
        return format_html(
            '<span style="color: {}; font-weight: bold;">{} ({:.2f})</span>',
            color, label, score
        )
    completion_quality_badge.short_description = 'Quality Score'
    completion_quality_badge.admin_order_field = 'completion_quality_score'
    
    def goals_display(self, obj):
        """Display goals in formatted list"""
        if not obj:
            return '-'
        
        goals = []
        if obj.goal_1:
            goals.append(f"1. {obj.goal_1}")
        if obj.goal_2:
            goals.append(f"2. {obj.goal_2}")
        if obj.goal_3:
            goals.append(f"3. {obj.goal_3}")
        
        if goals:
            return mark_safe('<br>'.join(goals))
        return 'No goals selected'
    goals_display.short_description = 'Selected Goals'
    
    def completion_metrics_display(self, obj):
        """Display completion metrics in formatted view"""
        if not obj:
            return '-'
        
        metrics = []
        if obj.duration_minutes:
            metrics.append(f"Duration: {obj.duration_minutes} minutes")
        
        metrics.append(f"Sections: {obj.sections_completed}/3")
        metrics.append(f"Goals: {obj.goals_selected}")
        
        if obj.form_interactions:
            metrics.append(f"Interactions: {obj.form_interactions}")
        
        if obj.page_revisits:
            metrics.append(f"Revisits: {obj.page_revisits}")
        
        if obj.saved_progress:
            metrics.append("Progress: Saved")
        
        return mark_safe('<br>'.join(metrics))
    completion_metrics_display.short_description = 'Completion Metrics'
    
    def get_queryset(self, request):
        """Optimize queryset with select_related"""
        return super().get_queryset(request).select_related('user')
    
    actions = ['export_research_data']
    
    def export_research_data(self, request, queryset):
        """Export selected discovery data for research analysis"""
        response = HttpResponse(content_type='text/csv')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        response['Content-Disposition'] = f'attachment; filename="vitalpath_discovery_data_{timestamp}.csv"'
        
        writer = csv.writer(response)
        
        # Write header
        writer.writerow([
            'UUID', 'User_Email', 'Preferred_Name', 'Age', 'Gender', 
            'Location', 'Goal_1', 'Goal_2', 'Goal_3', 'Goals_Selected',
            'Baseline_Fulfillment', 'Baseline_Happiness', 'Baseline_Energy',
            'Baseline_Stress', 'Baseline_Sleep', 'Baseline_Activity',
            'Baseline_Nutrition', 'Baseline_Purpose', 'Baseline_Motivation',
            'Baseline_Confidence', 'Avg_Wellness_Score',
            'Duration_Minutes', 'Completion_Quality_Score', 'Submitted_At'
        ])
        
        # Write data rows
        for obj in queryset:
            writer.writerow([
                str(obj.uuid), obj.user.email if obj.user else '', 
                obj.preferred_name, obj.age, obj.gender,
                obj.location, obj.goal_1, obj.goal_2, obj.goal_3, obj.goals_selected,
                obj.baseline_fulfillment, obj.baseline_happiness, obj.baseline_energy,
                obj.baseline_stress, obj.baseline_sleep, obj.baseline_activity,
                obj.baseline_nutrition, obj.baseline_purpose, obj.baseline_motivation,
                obj.baseline_confidence, obj.avg_wellness_score,
                obj.duration_minutes, obj.completion_quality_score,
                obj.submitted_at.strftime('%Y-%m-%d %H:%M:%S') if obj.submitted_at else ''
            ])
        
        self.message_user(request, f"Exported {queryset.count()} discovery records.")
        return response
    export_research_data.short_description = "Export research data (CSV)"


@admin.register(DiscoverySession)
class DiscoverySessionAdmin(admin.ModelAdmin):
    """Admin interface for discovery sessions."""
    
    list_display = [
        'uuid_short', 'user_email', 'session_status', 'session_start'
    ]
    
    list_filter = [
        'is_completed', 'last_active_section', 
        ('session_start', admin.DateFieldListFilter)
    ]
    
    search_fields = ['user__email', 'uuid']
    
    def uuid_short(self, obj):
        """Display shortened UUID"""
        return str(obj.uuid)[:8] + '...' if obj else '-'
    uuid_short.short_description = 'Session ID'
    
    def user_email(self, obj):
        """Display user email"""
        return obj.user.email if obj and obj.user else '-'
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def session_status(self, obj):
        """Display session status"""
        if not obj:
            return '-'
        if obj.is_completed:
            return format_html('<span style="color: green;">✓ Completed</span>')
        else:
            return format_html('<span style="color: orange;">⏳ Section {}</span>', obj.last_active_section)
    session_status.short_description = 'Status'


# Custom admin site configuration
admin.site.site_header = "VitalPath Research Administration"
admin.site.site_title = "VitalPath Research Admin"
admin.site.index_title = "Research Data Management"