#Copilot assisted file. All code was reviewed, tested, and modified by me for my needs.

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Task
from django.utils import timezone
from datetime import timedelta
from .views import user_create, getData, addTask, deleteTask, editTask
# Successfully creates new users
# Properly handles duplicate username attempts

# Successfully adds new tasks
# Handles daily repeat task creation
# Gets tasks for authenticated users
# Blocks unauthenticated access


class TestViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            "username": "testingtheusername",
            "password": "testingthepassword",
            "confirmPassword": "testingthepassword"
        }
        self.user = User.objects.create_user(username='usertested', password='usertestedpassword')
        self.task_data = {
            "name": "testingthetask",
            "description": "testingthedescription",
            "duration": 2,
            "start_time": timezone.now() + timedelta(hours=1),
            "due_date": timezone.now() + timedelta(days=1),
            "repeat": "none"
        }


    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_user_create_success(self):
        response = self.client.post("/user/create/", self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testingtheusername').exists())

    def test_user_create_duplicate_username(self):
        self.client.post("/user/create/", self.user_data)
        response = self.client.post("/user/create/", self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["reason"], "Username taken.")

    def test_get_data_authenticated(self):
        self.authenticate()
        response = self.client.get("/retrieve")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_data_unauthenticated(self):
        response = self.client.get("/retrieve")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_task_success(self):
        self.authenticate()
        response = self.client.post("/add/", self.task_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Task.objects.filter(name="testingthetask").exists())

    def test_add_task_with_daily_repeat(self):
        self.authenticate()
        self.task_data["repeat"] = "daily"
        response = self.client.post("/add/", self.task_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tasks = Task.objects.filter(name="testingthetask")
        self.assertTrue(len(tasks) > 1)

def test_delete_task_success(self):
    self.authenticate()
    task = Task.objects.create(
        user=self.user,
        name="testingthetask",
        description="testingthedescription",
        duration=2,
        start_time=timezone.now(),
        repeat="none"
    )
    response = self.client.delete(
        f"/delete/{task.id}/",
        content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.assertFalse(Task.objects.filter(id=task.id).exists())

def test_edit_task_success(self):
    self.authenticate()
    task = Task.objects.create(
        user=self.user,
        name="testingthetask",
        description="testingthedescription",
        duration=2,
        start_time=timezone.now(),
        repeat="none"
    )
    updated_data = {
        "name": "testingupdatedtask",
        "description": "testingupdatedescription",
        "duration": 3,
        "start_time": (timezone.now() + timedelta(hours=2)).isoformat(),
        "repeat": "none"
    }
    response = self.client.put(
        f"/edit/{task.id}/",
        data=updated_data,
        content_type='application/json'
    )
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    updated_task = Task.objects.get(id=task.id)
    self.assertEqual(updated_task.name, "testingupdatedtask")
    self.assertEqual(updated_task.description, "testingupdatedescription")
    self.assertEqual(updated_task.duration, 3)
    

