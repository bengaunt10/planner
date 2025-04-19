from django.urls import path
from .views import getData, addTask ,editTask,deleteTask, addGratitude, getGratitude, deleteGratitude, editGratitude
from django.urls import path

urlpatterns = [
    path("add/", addTask, name="add_task"),
    path("retrieve", getData, name="get_data"),
    path("delete/<int:taskID>/", deleteTask, name="delete_task"),
    path("edit/<int:taskID>/", editTask, name="edit_task"),
    path("addgratitude/", addGratitude, name="add_gratitude"),
    path("retrievegratitude", getGratitude, name="get_gratitude"),
    path("deletegratitude/<int:gratitudeID>/", deleteGratitude, name="delete_gratitude"),
    path("editgratitude/<int:gratitudeID>/", editGratitude, name="edit_gratitude"),
]
