from .models import Task
from datetime import timedelta, datetime, date, time
from django.utils.timezone import now, make_aware
from django.utils import timezone

#overlap checker function:
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

#Self scheduling function:
def calculate(taskDuration, dueDate, user=None):

    if user is None:
        return False

    taskDuration = timedelta(hours=taskDuration)
    currentTime = timezone.localtime()
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
                newTime = currentTime + timedelta(minutes=15)
                newTime = newTime.replace(second=0, microsecond=0)
                if newTime.hour < earliestHour:
                    newTime = make_aware(datetime.combine(dayOn.date(), time(hour=earliestHour)))
            else:
                newTime = make_aware(datetime.combine(dayOn.date(), time(hour=earliestHour)))
            while newTime + taskDuration <= make_aware(datetime.combine(dayOn.date(), time(hour=latestHour))): 
                if not overlap_checker(newTime, taskDuration, user=user):
                    return newTime + timedelta(hours=0.25) 
                newTime += timedelta(hours=1) 

    for dayOn in OrderedDays:
        if dayHours[dayOn] + taskDuration.total_seconds() / 3600 <= 24:
            newTime = make_aware(datetime.combine(dayOn.date(), time(hour=earliestHour)))
            while newTime + taskDuration <= make_aware(datetime.combine(dayOn.date(), time(hour=latestHour))):
                if not overlap_checker(newTime, taskDuration, user=user):
                    return newTime + timedelta(hours=0.25) 
                newTime += timedelta(hours=1)

    return None


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