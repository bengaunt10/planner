from django.urls import path
from .views import api, task_api, getData, addNote,editTask,deleteTask

urlpatterns = [
    path('test/', api),  # This will be available at http://127.0.0.1:8000/test/
    path("tasks", task_api, name="tasksApi"),
    path("drftest/", getData),
    path("drftest/add/", addNote),
    path("drftest/delete/<int:taskID>/", deleteTask, name="delete_task"),
    path("drftest/edit/<int:taskID>/", editTask, name="delete_task"),

]
