#Copilot assisted file. All code was reviewed, tested, and modified by me.
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Task, Gratitudes
from django.utils import timezone
from datetime import timedelta
from .views import user_create, getData, addTask, deleteTask, editTask

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

    def test_userCreation(self):
        response = self.client.post("/user/create/", self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testingtheusername').exists())

    def test_UsernameTaken(self):
        self.client.post("/user/create/", self.user_data)
        response = self.client.post("/user/create/", self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["reason"], "Username taken.")

    def test_retrieveTasks(self):
        self.authenticate()
        response = self.client.get("/retrieve")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieveTasksOnlyWhenAuthenticated(self):
        response = self.client.get("/retrieve")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_addTask(self):
        self.authenticate()
        response = self.client.post("/add/", self.task_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Task.objects.filter(name="testingthetask").exists())

    def test_addRepeatingTask(self):
        self.authenticate()
        self.task_data["repeat"] = "daily"
        response = self.client.post("/add/", self.task_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        tasks = Task.objects.filter(name="testingthetask")
        self.assertTrue(len(tasks) > 1)

    def test_deleteTask(self):
        self.authenticate()
        #change to use self task data
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

    def test_editTask(self):
        self.authenticate()
        current_time = timezone.now()
        task = Task.objects.create(
            user=self.user,
            name="testingthetask",
            description="testingthedescription",
            duration=2,
            start_time=current_time,
            due_date=current_time + timedelta(days=1),
            repeat="none"
        )
        
        updated_data = {
            "name": "testingupdatedtask",
            "description": "testingupdatedescription",
            "duration": 3,
            "start_time": (current_time + timedelta(hours=2)).isoformat(),
            "due_date": (current_time + timedelta(days=1)).isoformat(),
            "repeat": "none"
        }
        
        response = self.client.put(
            f"/edit/{task.id}/",
            data=updated_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        updated_task = Task.objects.get(id=task.id)
        self.assertEqual(updated_task.name, "testingupdatedtask")
        self.assertEqual(updated_task.description, "testingupdatedescription")
        self.assertEqual(updated_task.duration, 3)

    def test_noOverlap(self):
        self.authenticate()

        first_task = Task.objects.create(
            user=self.user,
            name="First Task",
            description="First task description",
            duration=2,
            start_time=timezone.now() + timedelta(hours=1),
            repeat="none"
        )

        overlapping_task_data = self.task_data.copy()
        overlapping_task_data["start_time"] = first_task.start_time + timedelta(minutes=30)
        
        response = self.client.post("/add/", overlapping_task_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("OVERLAP", response.data)

    def test_selfscheduleTask(self):
        self.authenticate()
        scheduledTask = {
            "name": "Automatically Scheduled Task",
            "description": "The system is scheduling thist task for the user.",
            "duration": 2,
            "due_date": timezone.localtime() + timedelta(days=2),
            "repeat": "none"
        }
        response = self.client.post("/add/", scheduledTask)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        taskCreated = Task.objects.get(name="Automatically Scheduled Task")
        task_hour = timezone.localtime(taskCreated.start_time).hour
        self.assertTrue(8 <= task_hour <= 22)
        self.assertEqual(taskCreated.name, "Automatically Scheduled Task")
        self.assertTrue(
            taskCreated.start_time + timedelta(hours=taskCreated.duration) <= scheduledTask["due_date"]
        )

class TestGratitudeViews(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='gratitudetest', password='testpassword123')
        self.gratitude_data = {
            "gratitudes": "I am grateful for testing",
            "doneToday": "Wrote test cases",
            "bestPartToday": "Tests passing"
        }

    def authenticate(self):
        self.client.force_authenticate(user=self.user)

    def test_addGratitude(self):
        self.authenticate()
        response = self.client.post("/addgratitude/", self.gratitude_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Gratitudes.objects.filter(gratitudes="I am grateful for testing").exists())


    def test_editGratitude(self):
        self.authenticate()
        gratitude = Gratitudes.objects.create(
            user=self.user,
            gratitudes="Original gratitude",
            doneToday="Original done",
            bestPartToday="Original best part"
        )
        updated_data = {
            "gratitudes": "Updated gratitude",
            "doneToday": "Updated done",
            "bestPartToday": "Updated best part",
            "created": timezone.now().isoformat()
        }
        response = self.client.put(
            f"/editgratitude/{gratitude.id}/",
            data=updated_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_gratitude = Gratitudes.objects.get(id=gratitude.id)
        self.assertEqual(updated_gratitude.gratitudes, "Updated gratitude")
        self.assertEqual(updated_gratitude.doneToday, "Updated done")
        self.assertEqual(updated_gratitude.bestPartToday, "Updated best part")

    def test_deleteGratitude(self):
        self.authenticate()
        gratitude = Gratitudes.objects.create(
            user=self.user,
            gratitudes="Test gratitude",
            doneToday="Test done",
            bestPartToday="Test best part"
        )
        response = self.client.delete(f"/deletegratitude/{gratitude.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Gratitudes.objects.filter(id=gratitude.id).exists())
