from .models import Task
from datetime import timedelta

def overlap_checker(taskStart, duration):
    tasks = Task.objects.all()
    taskEnd = taskStart + timedelta(hours=duration)
    for t in tasks:
        if t.start_time < taskStart and t.end_time > taskStart: #if the start date of new task being added is between the start and end time of the current task in the loop..
            return True
        elif t.start_time < taskEnd and t.end_time > taskEnd:
            return True
    return False