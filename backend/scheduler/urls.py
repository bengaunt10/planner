from django.urls import path
from .views import getData, addTask ,editTask,deleteTask
from django.urls import path

urlpatterns = [
    path("add/", addTask),
    path("retrieve", getData),
    path("delete/<int:taskID>/", deleteTask, name="delete_task"),
    path("edit/<int:taskID>/", editTask, name="delete_task"),
]
