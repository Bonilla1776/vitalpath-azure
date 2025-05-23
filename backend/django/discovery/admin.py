# backend/django/discovery/admin.py - COMPLETE RESEARCH ADMIN
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.http import HttpResponse
from .models import DiscoveryData, DiscoverySession
import csv
from datetime import datetime
import json

@admin.register(DiscoveryData)
class DiscoveryDataAdmin(admin.ModelAdmin):
    """
    Enhanced admin interface for discovery data with research analytics.
    Provides comprehensive view of user assessments and data quality.
    """
    
    list_display = [
        'preferred_name', 'user_email', 'age', 'gender', 'completion_quality_badge',
        'duration_minutes', 'goals_selected', 'avg_wellness_score', 'submitted_at'
    ]
    
    list_filter = [
        'gender', 'marital_status', 'goals_selected', 'sections_completed',
        ('completion_quality_score', admin.filters.SimpleListFilter),
        ('duration_minutes', admin.filters.SimpleListFilter),
        'submitted_at', 'data_version'
    ]
    
    search_fields = [
        'preferred_name', 'user__email', 'location', 'goal_1', 'goal_2', 'goal_3'
    ]
    
    readonly_fields = [
        'uuid', 'user', 'submitted_at', 'updated_at', 'bmi', 'bmi_category',
        'height_total_inches', 'height_cm', 'weight_kg', 'completion_quality_score',
        'baseline_wellness_chart', 'goals_display', 'completion_metrics_display'
    ]
    
    fieldsets = (
        ('User Information', {
            'fields': ('uuid', 'user', 'preferred_name')
        }),
        ('Demographics', {
            'fields': (
                ('age', 'gender'), 
                ('height_feet', 'height_inches', 'height_total_inches', 'height_cm'),
                ('weight', 'weight_kg', 'bmi', 'bmi_category'),
                'location', 'marital_status'
            )
        }),
        ('Health Goals', {
            'fields': ('goals_display', 'goal_1', 'goal_2', 'goal_3')
        }),
        ('Baseline Wellness Indicators', {
            'fields': (
                'baseline_wellness_chart',
                ('baseline_fulfillment', 'baseline_happiness'),
                ('baseline_energy', 'baseline_sleep'),
                ('baseline_activity', 'baseline_nutrition'),
                ('baseline_stress', 'baseline_purpose'),
                ('baseline_motivation', 'baseline_confidence'),
                'avg_wellness_score'
            )
        }),
        ('Completion Metrics', {
            'fields': (
                'completion_metrics_display',
                ('duration_minutes', 'sections_completed', 'goals_selected'),
                ('form_interactions', 'page_revisits', 'saved_progress'),
                ('completion_device_type', 'completion_browser'),
                'completion_quality_score'
            )
        }),
        ('Research Data', {
            'fields': ('data_version', 'submitted_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )
    
    def user_email(self, obj):
        """Display user email with link to user admin"""
        if obj.user:
            url = reverse('admin:auth_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.email)
        return '-'
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'
    
    def completion_quality_badge(self, obj):
        """Display completion quality as colored badge"""
        if obj.completion_quality_score is None:
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
    
    def baseline_wellness_chart(self, obj):
        """Display baseline wellness scores as a mini chart"""
        if not obj:
            return '-'
        
        indicators = [
            ('Fulfillment', obj.baseline_fulfillment),
            ('Happiness', obj.baseline_happiness),
            ('Energy', obj.baseline_energy),
            ('Stress Mgmt', obj.baseline_stress),
            ('Sleep', obj.baseline_sleep),
            ('Activity', obj.baseline_activity),
            ('Nutrition', obj.baseline_nutrition),
            ('Purpose', obj.baseline_purpose),
            ('Motivation', obj.baseline_motivation),
            ('Confidence', obj.baseline_confidence),
        ]
        
        chart_html = '<div style="font-family: monospace; font-size: 12px;">'
        for label, score in indicators:
            bar_width = int(score * 2)  # Scale to 200px max
            color = '#4CAF50' if score >= 70 else '#FF9800' if score >= 40 else '#F44336'
            
            chart_html += f'''
            <div style="margin: 2px 0; display: flex; align-items: center;">
                <span style="width: 80px; display: inline-block;">{label}:</span>
                <div style="width: 200px; background: #eee; height: 12px; margin: 0 5px; position: relative;">
                    <div style="width: {bar_width}px; background: {color}; height: 100%;"></div>
                </div>
                <span style="width: 30px; text-align: right;">{score}</span>
            </div>
            '''
        
        chart_html += '</div>'
        return mark_safe(chart_html)
    baseline_wellness_chart.short_description = 'Wellness Baseline Chart'
    
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
    
    actions = ['export_research_data', 'export_wellness_data', 'recalculate_quality_scores']
    
    def export_research_data(self, request, queryset):
        """Export selected discovery data for research analysis"""
        response = HttpResponse(content_type='text/csv')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        response['Content-Disposition'] = f'attachment; filename="vitalpath_discovery_data_{timestamp}.csv"'
        
        writer = csv.writer(response)
        
        # Write comprehensive header for research
        writer.writerow([
            'Participant_UUID', 'User_Email', 'Preferred_Name', 'Age', 'Gender', 'Height_Inches', 
            'Weight_Lbs', 'BMI', 'BMI_Category', 'Location', 'Marital_Status',
            'Primary_Goal', 'Secondary_Goal', 'Tertiary_Goal', 'Total_Goals_Selected',
            'Baseline_Fulfillment', 'Baseline_Happiness', 'Baseline_Energy',
            'Baseline_Stress', 'Baseline_Sleep', 'Baseline_Activity',
            'Baseline_Nutrition', 'Baseline_Purpose', 'Baseline_Motivation',
            'Baseline_Confidence', 'Avg_Wellness_Score',
            'Completion_Duration_Minutes', 'Sections_Completed', 'Form_Interactions',
            'Page_Revisits', 'Progress_Saved', 'Completion_Device', 'Completion_Browser',
            'Completion_Quality_Score', 'Data_Version', 'Submitted_DateTime'
        ])
        
        # Write data rows
        for obj in queryset:
            writer.writerow([
                str(obj.uuid), obj.user.email, obj.preferred_name, obj.age, obj.gender,
                obj.height_total_inches, obj.weight, obj.bmi, obj.bmi_category, 
                obj.location, obj.marital_status,
                obj.goal_1, obj.goal_2, obj.goal_3, obj.goals_selected,
                obj.baseline_fulfillment, obj.baseline_happiness, obj.baseline_energy,
                obj.baseline_stress, obj.baseline_sleep, obj.baseline_activity,
                obj.baseline_nutrition, obj.baseline_purpose, obj.baseline_motivation,
                obj.baseline_confidence, obj.avg_wellness_score,
                obj.duration_minutes, obj.sections_completed, obj.form_interactions,
                obj.page_revisits, obj.saved_progress, obj.completion_device_type,
                obj.completion_browser, obj.completion_quality_score, obj.data_version,
                obj.submitted_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        self.message_user(request, f"Successfully exported {queryset.count()} discovery records for research analysis.")
        return response
    export_research_data.short_description = "Export comprehensive research data (CSV)"
    
    def export_wellness_data(self, request, queryset):
        """Export only wellness baseline data for statistical analysis"""
        response = HttpResponse(content_type='text/csv')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        response['Content-Disposition'] = f'attachment; filename="vitalpath_wellness_baselines_{timestamp}.csv"'
        
        writer = csv.writer(response)
        
        # Write wellness-focused header
        writer.writerow([
            'Participant_UUID', 'Age', 'Gender', 'BMI',
            'Fulfillment', 'Happiness', 'Energy', 'Stress_Management',
            'Sleep_Quality', 'Physical_Activity', 'Nutrition_Quality',
            'Life_Purpose', 'Change_Motivation', 'Self_Efficacy',
            'Overall_Wellness_Average', 'Quality_Score', 'Date_Submitted'
        ])
        
        # Write wellness data
        for obj in queryset:
            writer.writerow([
                str(obj.uuid), obj.age, obj.gender, obj.bmi,
                obj.baseline_fulfillment, obj.baseline_happiness, obj.baseline_energy,
                obj.baseline_stress, obj.baseline_sleep, obj.baseline_activity,
                obj.baseline_nutrition, obj.baseline_purpose, obj.baseline_motivation,
                obj.baseline_confidence, obj.avg_wellness_score, obj.completion_quality_score,
                obj.submitted_at.strftime('%Y-%m-%d')
            ])
        
        self.message_user(request, f"Exported wellness baseline data for {queryset.count()} participants.")
        return response
    export_wellness_data.short_description = "Export wellness baselines only (CSV)"
    
    def recalculate_quality_scores(self, request, queryset):
        """Recalculate completion quality scores for selected records"""
        updated_count = 0
        for obj in queryset:
            old_score = obj.completion_quality_score
            obj.calculate_completion_quality()
            obj.save()
            updated_count += 1
        
        self.message_user(request, f"Recalculated quality scores for {updated_count} records.")
    recalculate_quality_scores.short_description = "Recalculate quality scores"


@admin.register(DiscoverySession)
class DiscoverySessionAdmin(admin.ModelAdmin):
    """
    Admin interface for discovery sessions - research journey tracking.
    Provides insights into user completion patterns and engagement.
    """
    
    list_display = [
        'uuid_short', 'user_email', 'session_status', 'last_active_section',
        'total_duration_display', 'session_start', 'has_discovery_data'
    ]
    
    list_filter = [
        'is_completed', 'last_active_section', 'session_start',
        ('session_start', admin.DateFieldListFilter)
    ]
    
    search_fields = ['user__email', 'uuid', 'user_agent']
    
    readonly_fields = [
        'uuid', 'user', 'session_start', 'total_duration_minutes',
        'session_timeline', 'technical_details'
    ]
    
    fieldsets = (
        ('Session Information', {
            'fields': ('uuid', 'user', 'discovery_data', 'session_status')
        }),
        ('Progress Tracking', {
            'fields': (
                ('session_start', 'session_end', 'total_duration_minutes'),
                'last_active_section', 'is_completed',
                'session_timeline'
            )
        }),
        ('Section Timing', {
            'fields': (
                ('section_1_time', 'section_2_time', 'section_3_time'),
            )
        }),
        ('Technical Details', {
            'fields': ('technical_details', 'user_agent', 'ip_address', 'screen_resolution'),
            'classes': ('collapse',)
        })
    )
    
    def uuid_short(self, obj):
        """Display shortened UUID"""
        return str(obj.uuid)[:8] + '...'
    uuid_short.short_description = 'Session ID'
    
    def user_email(self, obj):
        """Display user email with link"""
        if obj.user:
            url = reverse('admin:auth_user_change', args=[obj.user.id])
            return format_html('<a href="{}">{}</a>', url, obj.user.email)
        return '-'
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def session_status(self, obj):
        """Display session status with color coding"""
        if obj.is_completed:
            return format_html('<span style="color: green; font-weight: bold;">✓ Completed</span>')
        else:
            return format_html('<span style="color: orange;">⏳ Section {}</span>', obj.last_active_section)
    session_status.short_description = 'Status'
    session_status.admin_order_field = 'is_completed'
    
    def total_duration_display(self, obj):
        """Display total duration in readable format"""
        duration = obj.total_duration_minutes
        if duration is None:
            if obj.is_completed:
                return format_html('<span style="color: red;">Missing</span>')
            else:
                return format_html('<span style="color: gray;">In Progress</span>')
        
        if duration < 5:
            color = 'red'  # Too fast
        elif duration > 60:
            color = 'orange'  # Very slow
        else:
            color = 'green'  # Normal
        
        return format_html('<span style="color: {};">{:.1f} min</span>', color, duration)
    total_duration_display.short_description = 'Duration'
    total_duration_display.admin_order_field = 'total_duration_minutes'
    
    def has_discovery_data(self, obj):
        """Check if session resulted in discovery data"""
        if obj.discovery_data:
            url = reverse('admin:discovery_discoverydata_change', args=[obj.discovery_data.id])
            return format_html('<a href="{}">✓ Yes</a>', url)
        return format_html('<span style="color: gray;">No</span>')
    has_discovery_data.short_description = 'Completed Assessment'
    
    def session_timeline(self, obj):
        """Display session timeline visualization"""
        if not obj:
            return '-'
        
        timeline_html = '<div style="font-family: monospace; font-size: 12px;">'
        
        # Session start
        timeline_html += f'<div>📅 Started: {obj.session_start.strftime("%Y-%m-%d %H:%M:%S")}</div>'
        
        # Section timings
        sections = [
            ('Section 1 (About You)', obj.section_1_time),
            ('Section 2 (Goals)', obj.section_2_time),
            ('Section 3 (Assessment)', obj.section_3_time),
        ]
        
        timeline_html += '<div style="margin: 10px 0;">'
        for section_name, time_spent in sections:
            if time_spent:
                minutes = time_spent // 60
                seconds = time_spent % 60
                timeline_html += f'<div>⏱️ {section_name}: {minutes}m {seconds}s</div>'
            else:
                timeline_html += f'<div style="color: gray;">⏱️ {section_name}: Not completed</div>'
        timeline_html += '</div>'
        
        # Session end
        if obj.session_end:
            timeline_html += f'<div>✅ Completed: {obj.session_end.strftime("%Y-%m-%d %H:%M:%S")}</div>'
        elif obj.is_completed:
            timeline_html += '<div style="color: orange;">✅ Marked complete (no end time)</div>'
        else:
            timeline_html += f'<div style="color: gray;">⏳ Last active: Section {obj.last_active_section}</div>'
        
        timeline_html += '</div>'
        return mark_safe(timeline_html)
    session_timeline.short_description = 'Session Timeline'
    
    def technical_details(self, obj):
        """Display technical session details"""
        if not obj:
            return '-'
        
        details = []
        if obj.ip_address:
            details.append(f"IP: {obj.ip_address}")
        if obj.screen_resolution:
            details.append(f"Screen: {obj.screen_resolution}")
        
        # Parse user agent for readable info
        user_agent = obj.user_agent or ''
        if 'Chrome' in user_agent:
            browser = 'Chrome'
        elif 'Firefox' in user_agent:
            browser = 'Firefox'
        elif 'Safari' in user_agent:
            browser = 'Safari'
        elif 'Edge' in user_agent:
            browser = 'Edge'
        else:
            browser = 'Unknown'
        
        if 'Mobile' in user_agent or 'iPhone' in user_agent or 'Android' in user_agent:
            device = 'Mobile'
        elif 'iPad' in user_agent or 'Tablet' in user_agent:
            device = 'Tablet'
        else:
            device = 'Desktop'
        
        details.append(f"Browser: {browser}")
        details.append(f"Device: {device}")
        
        return mark_safe('<br>'.join(details))
    technical_details.short_description = 'Technical Info'
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('user', 'discovery_data')
    
    actions = ['mark_sessions_completed', 'export_session_data', 'export_completion_funnel']
    
    def mark_sessions_completed(self, request, queryset):
        """Mark selected sessions as completed"""
        updated = queryset.filter(is_completed=False).update(is_completed=True)
        self.message_user(request, f"Marked {updated} sessions as completed.")
    mark_sessions_completed.short_description = "Mark sessions as completed"
    
    def export_session_data(self, request, queryset):
        """Export session data for research analysis"""
        response = HttpResponse(content_type='text/csv')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        response['Content-Disposition'] = f'attachment; filename="vitalpath_session_data_{timestamp}.csv"'
        
        writer = csv.writer(response)
        
        # Write header
        writer.writerow([
            'Session_UUID', 'User_Email', 'Session_Start', 'Session_End',
            'Duration_Minutes', 'Is_Completed', 'Last_Active_Section',
            'Section_1_Time_Seconds', 'Section_2_Time_Seconds', 'Section_3_Time_Seconds',
            'Has_Discovery_Data', 'IP_Address', 'Screen_Resolution', 'Browser_Type', 'Device_Type'
        ])
        
        # Write data
        for session in queryset:
            # Parse user agent for browser/device info
            user_agent = session.user_agent or ''
            if 'Chrome' in user_agent:
                browser = 'Chrome'
            elif 'Firefox' in user_agent:
                browser = 'Firefox'
            elif 'Safari' in user_agent:
                browser = 'Safari'
            elif 'Edge' in user_agent:
                browser = 'Edge'
            else:
                browser = 'Unknown'
            
            if 'Mobile' in user_agent or 'iPhone' in user_agent or 'Android' in user_agent:
                device = 'Mobile'
            elif 'iPad' in user_agent or 'Tablet' in user_agent:
                device = 'Tablet'
            else:
                device = 'Desktop'
            
            writer.writerow([
                str(session.uuid), session.user.email,
                session.session_start.strftime('%Y-%m-%d %H:%M:%S'),
                session.session_end.strftime('%Y-%m-%d %H:%M:%S') if session.session_end else '',
                session.total_duration_minutes or '',
                session.is_completed, session.last_active_section,
                session.section_1_time or '', session.section_2_time or '', session.section_3_time or '',
                bool(session.discovery_data), session.ip_address or '',
                session.screen_resolution or '', browser, device
            ])
        
        self.message_user(request, f"Exported {queryset.count()} session records for research analysis.")
        return response
    export_session_data.short_description = "Export session data (CSV)"
    
    def export_completion_funnel(self, request, queryset):
        """Export completion funnel analysis data"""
        response = HttpResponse(content_type='application/json')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        response['Content-Disposition'] = f'attachment; filename="vitalpath_completion_funnel_{timestamp}.json"'
        
        # Calculate funnel metrics
        total_sessions = queryset.count()
        completed_sessions = queryset.filter(is_completed=True).count()
        
        section_completion = {
            'reached_section_1': queryset.filter(last_active_section__gte=1).count(),
            'reached_section_2': queryset.filter(last_active_section__gte=2).count(),
            'reached_section_3': queryset.filter(last_active_section__gte=3).count(),
            'completed_all': completed_sessions
        }
        
        # Average time per section
        avg_times = {
            'avg_section_1_time': queryset.filter(section_1_time__isnull=False).aggregate(
                avg=models.Avg('section_1_time'))['avg'],
            'avg_section_2_time': queryset.filter(section_2_time__isnull=False).aggregate(
                avg=models.Avg('section_2_time'))['avg'],
            'avg_section_3_time': queryset.filter(section_3_time__isnull=False).aggregate(
                avg=models.Avg('section_3_time'))['avg'],
        }
        
        funnel_data = {
            'total_sessions': total_sessions,
            'completion_rate': round(completed_sessions / total_sessions * 100, 2) if total_sessions > 0 else 0,
            'section_completion': section_completion,
            'average_section_times': avg_times,
            'export_timestamp': datetime.now().isoformat()
        }
        
        response.write(json.dumps(funnel_data, indent=2))
        self.message_user(request, f"Exported completion funnel analysis for {total_sessions} sessions.")
        return response
    export_completion_funnel.short_description = "Export completion funnel analysis (JSON)"


# Custom admin site configuration for better research UX
admin.site.site_header = "VitalPath Research Administration"
admin.site.site_title = "VitalPath Research Admin"
admin.site.index_title = "Research Data Management"