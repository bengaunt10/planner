from .models import Task
from datetime import timedelta, datetime, date, time
from django.utils.timezone import now, make_aware
from django.utils import timezone
#add django queries to improve performance time.

def overlap_checker(taskStart, duration, taskID = None, user=None):
    if user is None:
        return False
    
    tasks = Task.objects.filter(user=user)

    if not isinstance(duration, timedelta):
        duration = timedelta(hours=duration)


    taskEnd = taskStart + duration
    for t in tasks:
        if t.id == taskID:
            continue
        if t.start_time < taskEnd and t.end_time > taskStart: 
            return True
    return False

def calculate(taskDuration, dueDate, user=None):

    if user is None:
        return False

    taskDuration = timedelta(hours=taskDuration)
    currentTime = now()
    twoWeeksBefore = dueDate - timedelta(weeks=2)
    startLoopDate = max(currentTime, twoWeeksBefore)
    tasks = Task.objects.filter(user=user, start_time__date__gte=startLoopDate.date(), start_time__date__lte=dueDate.date())
    earliestHour = 8 
    latestHour = 22
    maxHoursInDay = 10
    daysBetween = (dueDate.date() - startLoopDate.date()).days
    dayHours = {}

    for i in range(daysBetween + 1):
        dayOn = startLoopDate + timedelta(days=i)
        dayHours[dayOn] = 0
        for t in tasks:
            if t.start_time.day == dayOn.day:
                dayHours[dayOn] += t.duration

    OrderedDays = sorted(dayHours, key=dayHours.get)

    for dayOn in OrderedDays:
        if dayHours[dayOn] + taskDuration.total_seconds() / 3600 <= maxHoursInDay:
            if dayOn.date() == currentTime.date():
                newTime = currentTime + timedelta(minutes=30)
                newTime = newTime.replace(second=0, microsecond=0)
                if newTime.hour < earliestHour:
                    newTime = make_aware(datetime.combine(dayOn.date(), time(hour=earliestHour)))
            else:
                newTime = make_aware(datetime.combine(dayOn.date(), time(hour=earliestHour)))
            while newTime + taskDuration <= make_aware(datetime.combine(dayOn.date(), time(hour=latestHour))): 
                if not overlap_checker(newTime, taskDuration, user=user):
                    return newTime
                newTime += timedelta(hours=1) 

    for dayOn in OrderedDays:
        if dayHours[dayOn] + taskDuration.total_seconds() / 3600 <= 24:
            newTime = make_aware(datetime.combine(dayOn.date(), time(hour=earliestHour)))
            while newTime + taskDuration <= make_aware(datetime.combine(dayOn.date(), time(hour=latestHour))):
                if not overlap_checker(newTime, taskDuration, user=user):
                    return newTime
                newTime += timedelta(hours=1)

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
    #if cant fit... work in reverse from due date... 


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