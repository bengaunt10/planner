from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User

#Database model for the gratitudes:
class Gratitudes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gratitudes = models.CharField(max_length=500)
    doneToday = models.CharField(max_length=500)
    bestPartToday = models.CharField(max_length=500)
    created = models.DateTimeField(auto_now_add=True)

# Database model for hte users tasks, including the outlined fields, a foreign key to the user, and calculates the end time based on the start time:
class Task(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=400)
    duration = models.FloatField()    
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(blank=True, null=True) 
    due_date = models.DateTimeField(null=True, blank=True)
    repeat = models.CharField(max_length=10,choices={
        "none": "none",
        "daily": "daily", 
        "weekly":"weekly",
        "duplicate": "duplicate"
    })
    repeat_id = models.IntegerField(default=0) 

    def save(self, *args, **kwargs):
        self.end_time = self.start_time + timezone.timedelta(hours=self.duration)
        super().save(*args, **kwargs)

