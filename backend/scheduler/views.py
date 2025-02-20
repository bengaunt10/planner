from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse
from .models import Task
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import TaskSerializer

@api_view(["GET"])
def getData(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def addNote(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

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
