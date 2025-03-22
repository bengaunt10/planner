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
# def calculate(taskDuration, dueDate):
#     # Get the current time
#     currentTime = timezone.now()
    
#     # Define the start of the scheduling window (2 weeks before the due date)
#     twoWeeksPrior = dueDate - timedelta(weeks=2)
    
#     # Determine the start date for scheduling
#     if currentTime.date() >= twoWeeksPrior.date():
#         startDate = currentTime.date()
#     else:
#         startDate = twoWeeksPrior.date()
    
#     # Calculate the number of days between the start date and the due date
#     daysBetween = (dueDate.date() - startDate).days
    
#     # Define user preferences for working hours
#     earliestHour = 8  # Earliest hour to schedule a task (8 AM)
#     latestHour = 22   # Latest hour to schedule a task (10 PM)
    
#     # Convert taskDuration to a timedelta object
#     taskDuration = timedelta(hours=taskDuration)
    
#     # Create a list of days in the scheduling window, sorted by least hours already allocated
#     days = []
#     for i in range(daysBetween + 1):
#         currentDay = startDate + timedelta(days=i)
        
#         # Get all tasks on the current day
#         tasksOnDay = Task.objects.filter(start_time__date=currentDay)
        
#         # Calculate total hours already allocated to tasks on this day
#         dayHours = sum(task.duration for task in tasksOnDay)
        
#         # Add the day and its allocated hours to the list
#         days.append((currentDay, dayHours))
    
#     # Sort the days by least hours already allocated (for balance)
#     days.sort(key=lambda x: x[1])
    
#     # Iterate over the sorted days
#     for day, dayHours in days:
#         # Check if the task can fit within the daily limit (10 hours)
#         if dayHours + taskDuration.total_seconds() / 3600 <= 10:
#             # Iterate over each hour in the working hours range
#             for hour in range(earliestHour, latestHour):
#                 # Calculate the potential start time for the task
#                 potentialStartTime = datetime.combine(day, datetime.min.time()) + timedelta(hours=hour)
                
#                 # Check if the task can be scheduled at this time without overlapping
#                 if not overlap_checker(potentialStartTime, taskDuration):
#                     return potentialStartTime  # Return the start time if no overlap
    
#     # If no suitable time is found within working hours, consider scheduling after 10 PM
#     for day, dayHours in days:
#         potentialStartTime = datetime.combine(day, datetime.min.time()) + timedelta(hours=latestHour)
#         if not overlap_checker(potentialStartTime, taskDuration):
#             return potentialStartTime  # Return the start time if no overlap
def calculate(taskDuration, dueDate, user=None):

    if user is None:
        return False
    
    # try:
    #     taskDuration = float(taskDuration)  # Convert to float (or int if appropriate)
    # except (ValueError, TypeError):
    #     return False
    # if isinstance(dueDate, str):
    #     # Parse the string into a datetime object
    #     try:
    #         dueDate = datetime.strptime(dueDate, "%Y-%m-%dT%H:%M")  # Match the format from datetime-local
    #     except ValueError:
    #         return False
    currentTime = datetime.now()
    twoWeeksBefore = dueDate - timedelta(weeks=2)

    startLoopDate = max(currentTime, twoWeeksBefore) # chooses a date 2 weeks before due date unless that is before the current date. so if due date in a week for example we will start checking from 
    # daysBetween = (dueDate.date() - startLoopDate.date()).days

    # tasks = Task.objects.filter(user=user)
    
    tasks = Task.objects.filter(user=user, start_time__date__gte=startLoopDate.date(), start_time__date__lte=dueDate.date())
   
    earliestHour = 8 #make users preference for all 3
    latestHour = 22
    maxHoursInDay = 10
    # taskDuration = timedelta(hours=taskDuration)
    daysBetween = (dueDate.date() - startLoopDate.date()).days
    dayHours = 0
    for i in range(daysBetween + 1):
        dayOn = startLoopDate + timedelta(days=i)
        for t in tasks:
            if t.start_time.day == dayOn.day:
                dayHours += t.duration

        if dayHours + taskDuration <= maxHoursInDay:
            newTime = datetime.combine(dayOn.date(), time(hour=earliestHour))
            while newTime + timedelta(hours=taskDuration) <= datetime.combine(dayOn.date(), time(hour=latestHour)): #while the end time for the new task doesn't exceed 10pm ... so add a task before 10pm.
                if overlap_checker(newTime, taskDuration, user=user):
                    return newTime
                newTime += timedelta(hours=1) #looks through each hour of the day.

    for i in range(daysBetween + 1):
        dayOn = startLoopDate + timedelta(days=i)
        for t in tasks:
            if t.start_time.day == dayOn.day:
                dayHours += t.duration

        if dayHours + taskDuration <= 24:
            newTime = datetime.combine(dayOn.date(), time(hour=earliestHour))
            while newTime + timedelta(hours=taskDuration) <= datetime.combine(dayOn.date(), time(hour=latestHour)): #while the end time for the new task doesn't exceed 10pm ... so add a task before 10pm.
                if overlap_checker(newTime, taskDuration, user=user):
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