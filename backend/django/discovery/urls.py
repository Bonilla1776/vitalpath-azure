# backend/django/discovery/urls.py - UPDATED
from django.urls import path
from .views import DiscoveryDataView, DiscoveryDataDetailView

urlpatterns = [
    path("", DiscoveryDataView.as_view(), name="submit-discovery"),
    path("me/", DiscoveryDataDetailView.as_view(), name="my-discovery"),
]
