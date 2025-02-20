from django.db import models
from django.utils import timezone

class Task(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=300)
    duration = models.IntegerField()    
    created = models.DateTimeField(auto_now_add=True)

    # startTime = models.DateTimeField()
    # endTime = models.DateTimeField()

    # def __str__(self):
    #     return f"{self.name}"
    
    # def as_dict(self):
    #     """A dictionary representation of the Task table"""
    #     return {
    #         'id': self.id,
    #         'name':self.name,
    #         'description':self.description,
    #         'startTime':self.startTime,
    #         'duration':self.duration,
    #         'endTime':self.endTime,
    #     }
# Create your models here.
