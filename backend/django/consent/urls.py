from django.urls import path
from .views import ConsentView

urlpatterns = [
    path("", ConsentView.as_view(), name="submit-consent"),
]
