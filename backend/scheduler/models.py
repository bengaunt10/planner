from django.db import models
from django.utils import timezone

class Task(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=300)
    duration = models.IntegerField()    
    # created = models.DateTimeField(auto_now_add=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    fixed = models.BooleanField() 
    repeat = models.CharField(max_length=10,choices={
        "none": "none",
        "daily": "daily", 
        "weekly":"weekly",
        "duplicate": "duplicate"
    })
    repeat_id = models.IntegerField(default=0) #Make sure doesn't delete other users repeating tasks with the same repeat id. Shouldn't if ur selecting the user specific task in first place tho.


