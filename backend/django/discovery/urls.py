from django.urls import path
from .views import DiscoveryDataView

urlpatterns = [
    path("", DiscoveryDataView.as_view(), name="submit-discovery"),
]
