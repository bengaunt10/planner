from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse
from.models import Task

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
