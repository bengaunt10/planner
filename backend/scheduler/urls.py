from django.urls import path
from .views import getData, addTask ,editTask,deleteTask
from django.urls import path

urlpatterns = [
    path("add/", addTask, name="add_task"),
    path("retrieve", getData, name="get_data"),
    path("delete/<int:taskID>/", deleteTask, name="delete_task"),
    path("edit/<int:taskID>/", editTask, name="edit_task"),
]
