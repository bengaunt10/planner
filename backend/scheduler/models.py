from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.models import User

#Paulo chceck my simple auth. make sure its ok for deployment and project. 
#temporary database

class Task(models.Model): #add this as a foreign key to user model later
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=300)
    duration = models.IntegerField()    
    # created = models.DateTimeField(auto_now_add=True)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(blank=True, null=True) # Remove end time - calculate end time based on start time + duration
    
    fixed = models.BooleanField() 
    repeat = models.CharField(max_length=10,choices={
        "none": "none",
        "daily": "daily", 
        "weekly":"weekly",
        "duplicate": "duplicate"
    })
    repeat_id = models.IntegerField(default=0) #Make sure doesn't delete other users repeating tasks with the same repeat id. Shouldn't if ur selecting the user specific task in first place tho.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.end_time = self.start_time + timezone.timedelta(hours=self.duration)
        super().save(*args, **kwargs)
