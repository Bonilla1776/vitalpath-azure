# backend/django/discovery/urls.py - ENHANCED WITH ANALYTICS
from django.urls import path
from .views import (
    DiscoveryDataView, 
    DiscoveryDataDetailView,
    DiscoverySessionView,
    DiscoveryAnalyticsView,
    DiscoveryListView,
    start_discovery_session,
    update_discovery_session
)

urlpatterns = [
    # Core discovery endpoints
    path("", DiscoveryDataView.as_view(), name="submit-discovery"),
    path("me/", DiscoveryDataDetailView.as_view(), name="my-discovery"),
    path("list/", DiscoveryListView.as_view(), name="discovery-list"),
    
    # Session tracking endpoints
    path("session/", DiscoverySessionView.as_view(), name="discovery-sessions"),
    path("session/start/", start_discovery_session, name="start-discovery-session"),
    path("session/<uuid:session_uuid>/update/", update_discovery_session, name="update-discovery-session"),
    
    # Research analytics endpoints
    path("analytics/", DiscoveryAnalyticsView.as_view(), name="discovery-analytics"),
]