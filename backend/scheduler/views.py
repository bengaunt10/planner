from django.shortcuts import render
from django.utils import timezone
from django.http import JsonResponse
from .models import Task, Gratitudes
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import TaskSerializer, UserSerializer, GratitudeSerializer
from datetime import timedelta
from rest_framework import status, generics
from .helper import overlap_checker
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from .helper import calculate


@api_view(["POST"])
@permission_classes([AllowAny]) #anyone..even if not authenticated can call this function - as it is to create a new user 
def user_create(request):
    username = request.data.get("username")
    if User.objects.filter(username=username).exists():
        return Response({"reason": "Username taken."}, status=status.HTTP_400_BAD_REQUEST)
    
    newPassword = request.data.get("password")
    confirmNewPassword = request.data.get("confirmPassword")

    if newPassword != confirmNewPassword:
        return Response({"reason": "Confirmed password does not match"}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(["GET"]) 
@permission_classes([IsAuthenticated])
def getData(request):
    user = request.user
    tasks = Task.objects.filter(user=user)
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@permission_classes([IsAuthenticated])
@api_view(["POST"])
def addTask(request):
        serializer = TaskSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            taskStartTime = serializer.validated_data['start_time']
            taskDuration = serializer.validated_data['duration']

            if overlap_checker(taskStartTime, taskDuration, user=request.user):
                return Response({"OVERLAP": "This task will overlap with an existing task. Please choose a different time."}, status=400)

            taskSaving = serializer.save(user=request.user)
            taskSaving.repeat_id = taskSaving.id
            taskSaving.save()
            if taskSaving.repeat == "daily":
                for i in range(1, 360):
                    addition = timedelta(days=i)
                    nextObjectStartTime = taskSaving.start_time + addition
                    if overlap_checker(nextObjectStartTime, taskSaving.duration, user=request.user) == False: 
                        Task.objects.create(
                            user = taskSaving.user,
                            name = taskSaving.name,
                            description = taskSaving.description,
                            duration = taskSaving.duration,
                            start_time = nextObjectStartTime,
                            repeat = "duplicate",
                            repeat_id = taskSaving.id
                        )
            if taskSaving.repeat == "weekly":
                for i in range(1, 52):
                    addition = timedelta(weeks=i)
                    nextObjectStartTime = taskSaving.start_time + addition
                    if overlap_checker(nextObjectStartTime, taskSaving.duration, user=request.user) == False: 
                        Task.objects.create(
                            user = taskSaving.user,
                            name = taskSaving.name,
                            description = taskSaving.description,
                            duration = taskSaving.duration,
                            start_time = nextObjectStartTime,
                            repeat = "duplicate",
                            repeat_id = taskSaving.id
                        )
            return Response(serializer.data)
        else:
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=400)



@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteTask(request, taskID):
    try: 
        taskToDelete = Task.objects.get(id=taskID, user=request.user)
        deleteRepeat = request.data.get("deleteRepeat") in ["true", "True", True]
        if deleteRepeat and taskToDelete.repeat != "none":
            Task.objects.filter(repeat_id=taskToDelete.repeat_id, user=request.user).delete()
        taskToDelete.delete()
        return Response({"Backend: Task deleted"})
    except:
        return Response({"Backend: Can't delete task"})


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def editTask(request, taskID):
    try: 
        task = Task.objects.get(id=taskID, user=request.user)
    except Task.DoesNotExist:
        return Response({"Backend: Task not found"}, status=404)
    serializer = TaskSerializer(task, data=request.data)
    if serializer.is_valid():
        taskStartTime = serializer.validated_data['start_time']
        durationofTask = serializer.validated_data['duration']
        if overlap_checker(taskStartTime, durationofTask, taskID, user=request.user):
            return Response({"OVERLAP": "This task will overlap with an existing task. Please choose a different time."}, status=400)
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"]) 
@permission_classes([IsAuthenticated])
def getGratitude(request):
    user = request.user
    gratitudes = Gratitudes.objects.filter(user=user)
    serializer = GratitudeSerializer(gratitudes, many=True)
    return Response(serializer.data)

@permission_classes([IsAuthenticated])
@api_view(["POST"])
def addGratitude(request):
        serializer = GratitudeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            gratitudeSaving = serializer.save(user=request.user)
            gratitudeSaving.save()
            return Response(serializer.data)
        else:
            print(f"Serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=400)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteGratitude(request, gratitudeID):
    try: 
        gratitudeToDelete = Gratitudes.objects.get(id=gratitudeID, user=request.user)
        gratitudeToDelete.delete()
        return Response({"Gratitude deleted"})
    except:
        return Response({"Can't delete gratitude"})


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def editGratitude(request, gratitudeID):
    try: 
        gratitude = Gratitudes.objects.get(id=gratitudeID, user=request.user)
    except Gratitudes.DoesNotExist:
        return Response({"Gratitude not found"}, status=404)
    serializer = GratitudeSerializer(gratitude, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

