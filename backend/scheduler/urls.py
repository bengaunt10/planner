from django.urls import path
from .views import api, task_api

urlpatterns = [
    path('test/', api),  # This will be available at http://127.0.0.1:8000/test/
    path("tasks", task_api, name="tasksApi")
]
