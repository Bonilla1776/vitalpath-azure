# discovery/models.py
from django.db import models
from django.conf import settings

class DiscoveryData(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    goal_1 = models.CharField(max_length=100, blank=True)
    goal_2 = models.CharField(max_length=100, blank=True)
    goal_3 = models.CharField(max_length=100, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
