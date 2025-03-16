from django.urls import path
from .views import getData, addTask ,editTask,deleteTask
from django.urls import path

urlpatterns = [
    path("retrieve", getData),
    path("add/", addTask),
    path("delete/<int:taskID>/", deleteTask, name="delete_task"),
    path("edit/<int:taskID>/", editTask, name="delete_task"),


]
