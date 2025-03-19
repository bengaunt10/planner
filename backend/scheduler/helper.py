from .models import Task
from datetime import timedelta, datetime, date, time

def overlap_checker(taskStart, duration, taskID = None, user=None):
    # Django queries to improve efficiency. in report talk about this one slow. looked into django queris, increased effiency time. 
    if user is None:
        return False  # If no user is provided, don't check anything

    tasks = Task.objects.filter(user=user)
    
    taskEnd = taskStart + timedelta(hours=duration)
    for t in tasks:
        if t.id == taskID:
            continue
        if t.start_time < taskStart and t.end_time > taskStart: #if the start date of new task being added is between the start and end time of the current task in the loop..
            return True
        elif t.start_time < taskEnd and t.end_time > taskEnd:
            return True
    return False

def calculate(taskDuration, dueDate, user=None):

    if user is None:
        return False
    
    if isinstance(dueDate, str):
        dueDate = datetime.strptime(dueDate, "%Y-%m-%dT%H:%M:%S") 

    currentTime = datetime.now()
    twoWeeksBefore = dueDate - timedelta(weeks=2)

    startLoopDate = max(currentTime, twoWeeksBefore) # chooses a date 2 weeks before due date unless that is before the current date. so if due date in a week for example we will start checking from 
    daysBetween = (dueDate.date() - startLoopDate.date()).days

    tasks = Task.objects.filter(user=user)
    
    earliestHour = 8 #make users preference for all 3
    latestHour = 22
    maxHoursInDay = 10
    taskDuration = timedelta(hours=taskDuration)
    
    for i in range(daysBetween + 1):
        dayHours = 0
        for t in tasks:
            if t.start_time.day == currentTime.day + i:
                dayHours += t.duration
        if dayHours + taskDuration <= 10:
            while newTime + taskDuration <= 10: #while the end time for the new task doesn't exceed 10pm ... so add a task before 10pm.
                if overlap_checker(newTime, taskDuration):
                    return newTime
                newTime += timedelta(hours=1) #looks through each hour of the day.

#     #Look at each day between now and the due date and make a list of these days in order of least hours already in them(for balance). Then go through each of these days
    # if no days left... alert user that the task will be added after 10pm. 
    # look through each day but after 10pm this time... should be a spot... what if not. idk about this edge case tho what makes sense? 
 # Maybe first attempt to add to 2 weeks before due date.. as in that timeframe. Cos if it's due in 20 weeks, it's not urgent. so probably schedule it in within week 18 or 19.
    #  check hours of tasks. If already 10 hours worth move to next day. Or if cant fit between 8am and 10pm move to next day(add users availaility hours input later)
                
    # For each day between now and the due date. 
    # Maybe first attempt to add to 2 weeks before due date.. as in that timeframe. Cos if it's due in 20 weeks, it's not urgent.
    #  check hours of tasks. If already 10 hours worth move to next day. Or if cant fit between 8am and 10pm move to next day(add users availaility hours input later)
    # if not 10 hours.. go through each hour and call check overlap with that time. If no overlap then create new start time at that hour.
    # if overlap then move to next hour.

    #if last option is to make start time after 10pm, alert user...if they say yes then it will be added    





    # look at datetime python stuff.
    #due date error handling? 
    # check time delta get days part. 
    #add availability hours option






# def scheduleAll(): --> schedule for week periods. 
    #for the week clicked on.... 
    #filter out all tasks that are not fixed.
    #sort by due date.
    #look at tasks array without fixed tasks in the calculate function.
    #for each task call calculate function to get start time.
    #save start time to task.
    # dynamic programming to balance tasks throughout week.


    # later algorithms:
        # add priority flags. Reshuffle tasks based on priority.
        # add full reshuffling algorithm using dynamic programming to find optimal order of tasks to complete in a day.