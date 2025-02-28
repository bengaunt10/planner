from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse
from .models import Task
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TaskSerializer
from datetime import timedelta

@api_view(["GET"]) #sends back endtime varialbe still but it is calculated using start time and duration
#either from selected start time or after my algorithm has been used
def getData(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def addNote(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        taskSaving = serializer.save()
        taskSaving.repeat_id = taskSaving.id
        taskSaving.save()
        print(f"Task saved: {taskSaving}")
        if taskSaving.repeat == "daily":
            for i in range(1, 360):
                addition = timedelta(days=i)
                Task.objects.create(
                    name = taskSaving.name,
                    description = taskSaving.description,
                    duration = taskSaving.duration,
                    start_time = taskSaving.start_time + addition,
                    end_time = taskSaving.end_time + addition,
                    fixed = taskSaving.fixed,
                    repeat = "duplicate",
                    repeat_id = taskSaving.id
                )
        if taskSaving.repeat == "weekly":
            for i in range(1, 52):
                addition = timedelta(weeks=i)
                Task.objects.create(
                    name = taskSaving.name,
                    description = taskSaving.description,
                    duration = taskSaving.duration,
                    start_time = taskSaving.start_time + addition,
                    end_time = taskSaving.end_time + addition,
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



def api(request):
    return JsonResponse({"message" : "yes"})


def task_api(request):
    return JsonResponse({
        "Tasks": [
            task.as_dict()
            for task in Task.objects.all() 
        ],
    })

# Create your views here.
