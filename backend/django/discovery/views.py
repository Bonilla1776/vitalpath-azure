# backend/django/discovery/views.py - ENHANCED RESEARCH-GRADE VERSION
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.db.models import Avg, Count, Q
from django.utils import timezone
from django.http import Http404
from .models import DiscoveryData, DiscoverySession
from .serializers import (
    DiscoveryDataSerializer, 
    DiscoverySessionSerializer,
    DiscoveryAnalyticsSerializer,
    DiscoveryDataSummarySerializer
)
import logging

logger = logging.getLogger(__name__)

class DiscoveryDataView(generics.CreateAPIView):
    """
    Enhanced discovery data creation endpoint with completion metrics support.
    Handles research-grade data collection with quality validation.
    """
    serializer_class = DiscoveryDataSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """Save discovery data with user context and session tracking"""
        try:
            # Save discovery data linked to the authenticated user
            discovery_data = serializer.save(user=self.request.user)
            
            # Log successful creation for research tracking
            logger.info(f"Discovery data created for user {self.request.user.id} - "
                       f"Quality Score: {discovery_data.completion_quality_score}")
            
            # Update any active discovery session
            active_session = DiscoverySession.objects.filter(
                user=self.request.user,
                is_completed=False
            ).first()
            
            if active_session:
                active_session.discovery_data = discovery_data
                active_session.mark_completed()
                logger.info(f"Discovery session {active_session.uuid} marked as completed")
        
        except Exception as e:
            logger.error(f"Error creating discovery data for user {self.request.user.id}: {str(e)}")
            raise
    
    def create(self, request, *args, **kwargs):
        """Enhanced create method with duplicate prevention and validation"""
        
        # Check if user already has discovery data
        existing_discovery = DiscoveryData.objects.filter(user=request.user).first()
        if existing_discovery:
            return Response(
                {
                    "detail": "Discovery data already exists. Use PUT to update existing data.",
                    "existing_uuid": str(existing_discovery.uuid),
                    "submitted_at": existing_discovery.submitted_at
                }, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Enhanced request data logging for research
        logger.info(f"Discovery data submission started for user {request.user.id}")
        
        response = super().create(request, *args, **kwargs)
        
        if response.status_code == status.HTTP_201_CREATED:
            logger.info(f"Discovery data successfully created for user {request.user.id}")
        
        return response


class DiscoveryDataDetailView(generics.RetrieveUpdateAPIView):
    """
    Enhanced discovery data detail view with analytics support.
    Allows retrieval and updates of existing discovery data.
    """
    serializer_class = DiscoveryDataSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'uuid'
    
    def get_object(self):
        """Get discovery data for authenticated user"""
        try:
            return DiscoveryData.objects.get(user=self.request.user)
        except DiscoveryData.DoesNotExist:
            raise Http404("Discovery data not found for this user.")
    
    def perform_update(self, serializer):
        """Enhanced update with research tracking"""
        discovery_data = serializer.save()
        logger.info(f"Discovery data updated for user {self.request.user.id} - "
                   f"New Quality Score: {discovery_data.completion_quality_score}")


class DiscoverySessionView(generics.CreateAPIView, generics.ListAPIView):
    """
    Discovery session tracking for research analytics.
    Tracks user journey through the discovery process.
    """
    serializer_class = DiscoverySessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return sessions for authenticated user"""
        return DiscoverySession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Create new discovery session with context"""
        user_agent = self.request.META.get('HTTP_USER_AGENT', '')
        ip_address = self.get_client_ip()
        
        serializer.save(
            user=self.request.user,
            user_agent=user_agent,
            ip_address=ip_address
        )
    
    def get_client_ip(self):
        """Extract client IP address for session tracking"""
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip


class DiscoveryAnalyticsView(APIView):
    """
    Research analytics endpoint for discovery data insights.
    Provides aggregated data for research analysis.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Generate comprehensive discovery analytics"""
        
        # Check if user has permission for analytics (could be admin-only)
        if not (request.user.is_staff or request.user.is_superuser):
            return Response(
                {"detail": "Analytics access requires staff permissions."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            # Basic completion metrics
            total_users = DiscoveryData.objects.count()
            total_sessions = DiscoverySession.objects.count()
            completed_sessions = DiscoverySession.objects.filter(is_completed=True).count()
            
            completion_rate = (completed_sessions / total_sessions * 100) if total_sessions > 0 else 0
            
            # Time-based analytics
            avg_completion_time = DiscoveryData.objects.filter(
                duration_minutes__isnull=False
            ).aggregate(avg_time=Avg('duration_minutes'))['avg_time'] or 0
            
            # Quality metrics
            avg_quality_score = DiscoveryData.objects.filter(
                completion_quality_score__isnull=False
            ).aggregate(avg_quality=Avg('completion_quality_score'))['avg_quality'] or 0
            
            # Demographics distribution
            age_distribution = self._get_age_distribution()
            gender_distribution = self._get_gender_distribution()
            
            # Goals analysis
            goals_analysis = self._get_goals_analysis()
            
            # Wellness baselines
            wellness_analysis = self._get_wellness_analysis()
            
            # Quality distribution
            quality_distribution = self._get_quality_distribution()
            
            analytics_data = {
                'total_completions': total_users,
                'average_completion_time': round(avg_completion_time, 1),
                'completion_rate': round(completion_rate, 1),
                'average_quality_score': round(avg_quality_score, 3),
                'age_distribution': age_distribution,
                'gender_distribution': gender_distribution,
                'top_goals': goals_analysis['top_goals'],
                'goals_distribution': goals_analysis['distribution'],
                'wellness_averages': wellness_analysis['averages'],
                'wellness_distributions': wellness_analysis['distributions'],
                'quality_distribution': quality_distribution,
                'completion_patterns': self._get_completion_patterns()
            }
            
            serializer = DiscoveryAnalyticsSerializer(analytics_data)
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Error generating discovery analytics: {str(e)}")
            return Response(
                {"detail": "Error generating analytics data."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _get_age_distribution(self):
        """Calculate age distribution for research analysis"""
        age_ranges = {
            '18-25': DiscoveryData.objects.filter(age__gte=18, age__lte=25).count(),
            '26-35': DiscoveryData.objects.filter(age__gte=26, age__lte=35).count(),
            '36-45': DiscoveryData.objects.filter(age__gte=36, age__lte=45).count(),
            '46-55': DiscoveryData.objects.filter(age__gte=46, age__lte=55).count(),
            '56-65': DiscoveryData.objects.filter(age__gte=56, age__lte=65).count(),
            '65+': DiscoveryData.objects.filter(age__gte=66).count(),
        }
        
        total = sum(age_ranges.values())
        if total > 0:
            return {k: round(v/total*100, 1) for k, v in age_ranges.items()}
        return age_ranges
    
    def _get_gender_distribution(self):
        """Calculate gender distribution"""
        gender_counts = DiscoveryData.objects.values('gender').annotate(count=Count('gender'))
        total = DiscoveryData.objects.count()
        
        distribution = {}
        for item in gender_counts:
            gender = item['gender']
            count = item['count']
            percentage = round(count/total*100, 1) if total > 0 else 0
            distribution[gender] = {
                'count': count,
                'percentage': percentage
            }
        
        return distribution
    
    def _get_goals_analysis(self):
        """Analyze health goals selection patterns"""
        # Collect all goals
        all_goals = []
        for discovery in DiscoveryData.objects.all():
            if discovery.goal_1:
                all_goals.append(discovery.goal_1)
            if discovery.goal_2:
                all_goals.append(discovery.goal_2)
            if discovery.goal_3:
                all_goals.append(discovery.goal_3)
        
        # Count occurrences
        from collections import Counter
        goal_counts = Counter(all_goals)
        
        # Top 10 goals
        top_goals = [
            {'goal': goal, 'count': count, 'percentage': round(count/len(all_goals)*100, 1)}
            for goal, count in goal_counts.most_common(10)
        ]
        
        return {
            'top_goals': top_goals,
            'distribution': dict(goal_counts),
            'total_goals_selected': len(all_goals)
        }
    
    def _get_wellness_analysis(self):
        """Analyze baseline wellness indicators"""
        wellness_fields = [
            ('baseline_fulfillment', 'Life Fulfillment'),
            ('baseline_happiness', 'Happiness'),
            ('baseline_energy', 'Energy'),
            ('baseline_stress', 'Stress Management'),
            ('baseline_sleep', 'Sleep Quality'),
            ('baseline_activity', 'Physical Activity'),
            ('baseline_nutrition', 'Nutrition'),
            ('baseline_purpose', 'Life Purpose'),
            ('baseline_motivation', 'Motivation'),
            ('baseline_confidence', 'Confidence')
        ]
        
        averages = {}
        distributions = {}
        
        for field, label in wellness_fields:
            # Calculate average
            avg_value = DiscoveryData.objects.aggregate(
                avg=Avg(field)
            )['avg'] or 0
            averages[label] = round(avg_value, 1)
            
            # Calculate distribution by ranges
            ranges = {
                '0-20': DiscoveryData.objects.filter(**{f"{field}__gte": 0, f"{field}__lte": 20}).count(),
                '21-40': DiscoveryData.objects.filter(**{f"{field}__gte": 21, f"{field}__lte": 40}).count(),
                '41-60': DiscoveryData.objects.filter(**{f"{field}__gte": 41, f"{field}__lte": 60}).count(),
                '61-80': DiscoveryData.objects.filter(**{f"{field}__gte": 61, f"{field}__lte": 80}).count(),
                '81-100': DiscoveryData.objects.filter(**{f"{field}__gte": 81, f"{field}__lte": 100}).count(),
            }
            distributions[label] = ranges
        
        return {
            'averages': averages,
            'distributions': distributions
        }
    
    def _get_quality_distribution(self):
        """Analyze completion quality score distribution"""
        quality_ranges = {
            'Excellent (0.8-1.0)': DiscoveryData.objects.filter(
                completion_quality_score__gte=0.8
            ).count(),
            'Good (0.6-0.79)': DiscoveryData.objects.filter(
                completion_quality_score__gte=0.6,
                completion_quality_score__lt=0.8
            ).count(),
            'Fair (0.4-0.59)': DiscoveryData.objects.filter(
                completion_quality_score__gte=0.4,
                completion_quality_score__lt=0.6
            ).count(),
            'Poor (0.0-0.39)': DiscoveryData.objects.filter(
                completion_quality_score__gte=0.0,
                completion_quality_score__lt=0.4
            ).count(),
        }
        
        total = sum(quality_ranges.values())
        if total > 0:
            return {k: {'count': v, 'percentage': round(v/total*100, 1)} 
                   for k, v in quality_ranges.items()}
        return quality_ranges
    
    def _get_completion_patterns(self):
        """Analyze completion time and interaction patterns"""
        return {
            'avg_duration_by_quality': self._get_duration_by_quality(),
            'completion_by_time_of_day': self._get_completion_by_time(),
            'device_usage': self._get_device_usage()
        }
    
    def _get_duration_by_quality(self):
        """Analyze relationship between completion time and quality"""
        quality_ranges = [
            (0.8, 1.0, 'High Quality'),
            (0.6, 0.8, 'Medium Quality'),
            (0.0, 0.6, 'Low Quality')
        ]
        
        results = {}
        for min_q, max_q, label in quality_ranges:
            avg_duration = DiscoveryData.objects.filter(
                completion_quality_score__gte=min_q,
                completion_quality_score__lt=max_q,
                duration_minutes__isnull=False
            ).aggregate(avg_duration=Avg('duration_minutes'))['avg_duration']
            
            results[label] = round(avg_duration, 1) if avg_duration else 0
        
        return results
    
    def _get_completion_by_time(self):
        """Analyze completion patterns by time of day"""
        from django.db.models import Extract
        
        hourly_completions = DiscoveryData.objects.annotate(
            hour=Extract('submitted_at', 'hour')
        ).values('hour').annotate(count=Count('id')).order_by('hour')
        
        time_periods = {
            'Morning (6-12)': 0,
            'Afternoon (12-18)': 0,
            'Evening (18-24)': 0,
            'Night (0-6)': 0
        }
        
        for item in hourly_completions:
            hour = item['hour']
            count = item['count']
            
            if 6 <= hour < 12:
                time_periods['Morning (6-12)'] += count
            elif 12 <= hour < 18:
                time_periods['Afternoon (12-18)'] += count
            elif 18 <= hour < 24:
                time_periods['Evening (18-24)'] += count
            else:
                time_periods['Night (0-6)'] += count
        
        return time_periods
    
    def _get_device_usage(self):
        """Analyze device types used for completion"""
        device_counts = DiscoveryData.objects.exclude(
            completion_device_type__exact=''
        ).values('completion_device_type').annotate(
            count=Count('completion_device_type')
        )
        
        return {item['completion_device_type']: item['count'] for item in device_counts}


class DiscoveryListView(generics.ListAPIView):
    """
    List view for discovery data summaries.
    Used for research participant overview and admin purposes.
    """
    serializer_class = DiscoveryDataSummarySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Return appropriate queryset based on user permissions"""
        if self.request.user.is_staff or self.request.user.is_superuser:
            # Staff can see all discovery data
            return DiscoveryData.objects.select_related('user').order_by('-submitted_at')
        else:
            # Regular users only see their own data
            return DiscoveryData.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def start_discovery_session(request):
    """
    Start a new discovery session for tracking user journey.
    Used for research analytics and user experience optimization.
    """
    try:
        # Check if there's already an active session
        active_session = DiscoverySession.objects.filter(
            user=request.user,
            is_completed=False
        ).first()
        
        if active_session:
            # Return existing session
            serializer = DiscoverySessionSerializer(active_session)
            return Response({
                'message': 'Active session found',
                'session': serializer.data
            })
        
        # Create new session
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR', '').split(',')[0] or request.META.get('REMOTE_ADDR', '')
        screen_resolution = request.data.get('screen_resolution', '')
        
        session = DiscoverySession.objects.create(
            user=request.user,
            user_agent=user_agent,
            ip_address=ip_address,
            screen_resolution=screen_resolution
        )
        
        serializer = DiscoverySessionSerializer(session)
        logger.info(f"Discovery session started for user {request.user.id}: {session.uuid}")
        
        return Response({
            'message': 'Discovery session started',
            'session': serializer.data
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error starting discovery session for user {request.user.id}: {str(e)}")
        return Response(
            {'detail': 'Error starting discovery session'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_discovery_session(request, session_uuid):
    """
    Update discovery session with section timing and progress.
    Used for detailed user journey analysis.
    """
    try:
        session = DiscoverySession.objects.get(
            uuid=session_uuid,
            user=request.user,
            is_completed=False
        )
        
        # Update session data
        data = request.data
        if 'last_active_section' in data:
            session.last_active_section = data['last_active_section']
        
        if 'section_1_time' in data:
            session.section_1_time = data['section_1_time']
        if 'section_2_time' in data:
            session.section_2_time = data['section_2_time']
        if 'section_3_time' in data:
            session.section_3_time = data['section_3_time']
        
        session.save()
        
        serializer = DiscoverySessionSerializer(session)
        return Response(serializer.data)
        
    except DiscoverySession.DoesNotExist:
        return Response(
            {'detail': 'Discovery session not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error updating discovery session {session_uuid}: {str(e)}")
        return Response(
            {'detail': 'Error updating discovery session'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
