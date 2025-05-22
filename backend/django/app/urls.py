from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse

def root_view(request):
    return JsonResponse({"status": "VitalPath Django backend is running."})

def health_check(request):
    return HttpResponse("OK", content_type="text/plain")

urlpatterns = [
    # 🔧 Health + root
    path("", root_view),
    path("healthz/", health_check),

    # 🔐 Admin + modules
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/consent/", include("consent.urls")),
    path("api/discovery/", include("discovery.urls")),
    path("api/dashboard/", include("dashboard.urls")),
]
