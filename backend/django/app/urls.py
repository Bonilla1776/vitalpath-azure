# backend/django/app/urls.py - ADD TOKEN REFRESH ENDPOINTS
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

def root_view(request):
    return JsonResponse({"status": "VitalPath Django backend is running."})

def health_check(request):
    return HttpResponse("OK", content_type="text/plain")

urlpatterns = [
    # 🔧 Health + root
    path("", root_view),
    path("healthz/", health_check),

    # 🔐 JWT Token endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # 🔐 Admin + modules
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/consent/", include("consent.urls")),
    path("api/discovery/", include("discovery.urls")),
    path("api/dashboard/", include("dashboard.urls")),
]