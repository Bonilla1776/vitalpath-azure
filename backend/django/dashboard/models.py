from django.db import models
from django.conf import settings

class ProgressEntry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    fulfillment = models.IntegerField(default=50)
    happiness = models.IntegerField(default=50)
    energy = models.IntegerField(default=50)
    stress = models.IntegerField(default=50)
    sleep = models.IntegerField(default=50)
    activity = models.IntegerField(default=50)
    nutrition = models.IntegerField(default=50)
    purpose = models.IntegerField(default=50)
    motivation = models.IntegerField(default=50)
    confidence = models.IntegerField(default=50)

    def __str__(self):
        return f"{self.user.email} - {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

