from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse
from .models import Task
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TaskSerializer
from datetime import timedelta
from rest_framework import status
from .helper import overlap_checker

#overlapping funtion in helper.py and add to post and put methods
#check if task overlaps with any other tasks
#Calculate end time based off duration added to start time


@api_view(["GET"]) #sends back endtime varialbe still but it is calculated using start time and duration
#either from selected start time or after my algorithm has been used
def getData(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def addTask(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        taskStartTime = serializer.validated_data['start_time']
        taskEndTime = serializer.validated_data['duration']
        if overlap_checker(taskStartTime, taskEndTime):
            return Response({"OVERLAP": "This task will overlap with an existing task. Please choose a different time."}, status=400)

        taskSaving = serializer.save()
        taskSaving.repeat_id = taskSaving.id
        
        taskSaving.save()
        print(f"Task saved: {taskSaving}")
        if taskSaving.repeat == "daily":
            for i in range(1, 360):
                addition = timedelta(days=i)
                nextObjectStartTime = taskSaving.start_time + addition
                if overlap_checker(nextObjectStartTime) == False: 
                    Task.objects.create(
                        name = taskSaving.name,
                        description = taskSaving.description,
                        duration = taskSaving.duration,
                        start_time = nextObjectStartTime,
                        fixed = taskSaving.fixed,
                        repeat = "duplicate",
                        repeat_id = taskSaving.id
                    )
        if taskSaving.repeat == "weekly":
            for i in range(1, 52):
                addition = timedelta(weeks=i)
                nextObjectStartTime = taskSaving.start_time + addition
                if overlap_checker(nextObjectStartTime) == False: 
                    Task.objects.create(
                        name = taskSaving.name,
                        description = taskSaving.description,
                        duration = taskSaving.duration,
                        start_time = nextObjectStartTime,
                        fixed = taskSaving.fixed,
                        repeat = "duplicate",
                        repeat_id = taskSaving.id
                    )
        return Response(serializer.data)
    else:
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=400)
    
    # return Response(serializer.data)

@api_view(["DELETE"])
def deleteTask(request, taskID):
    try: 
        taskToDelete = Task.objects.get(id=taskID)
        deleteRepeat = request.data.get("deleteRepeat") in ["true", "True", True]
        if deleteRepeat and taskToDelete.repeat != "none":
            Task.objects.filter(repeat_id=taskToDelete.repeat_id).delete()
        taskToDelete.delete()
        return Response({"Backend: Task deleted"})
    except:
        return Response({"Backend: Can't delete task"})

@api_view(["PUT"])
def editTask(request, taskID):
    try: 
        task = Task.objects.get(id=taskID)
    except Task.DoesNotExist:
        return Response({"Backend: Task not found"}, status=404)
    serializer = TaskSerializer(task, data=request.data)
    if serializer.is_valid():
        taskStartTime = serializer.validated_data['start_time']
        taskEndTime = serializer.validated_data['duration']
        if overlap_checker(taskStartTime, taskEndTime):
            return Response({"OVERLAP": "This task will overlap with an existing task. Please choose a different time."}, status=400)
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Create your views here.
