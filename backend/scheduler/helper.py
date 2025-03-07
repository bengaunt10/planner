from .models import Task
from datetime import timedelta

def overlap_checker(taskStart, duration, taskID = None):
    # Do it so it doesn't check the task being added itself
    tasks = Task.objects.all()
    taskEnd = taskStart + timedelta(hours=duration)
    for t in tasks:
        if t.id == taskID:
            continue
        if t.start_time < taskStart and t.end_time > taskStart: #if the start date of new task being added is between the start and end time of the current task in the loop..
            return True
        elif t.start_time < taskEnd and t.end_time > taskEnd:
            return True
    return False

def calculate():
    # for hours in next day.. if this hour filled with a task then move to next hour etc. 
    #  check hours of tasks. If already 10 hours worth move to next day
    # check next day . check overlap aswel

    # add due date thats only visible if etc etc 
    # look at timedelta stuff.
    #due date error handling? 
    pass