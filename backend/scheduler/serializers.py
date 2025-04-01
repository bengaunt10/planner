from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User
from .helper import calculate
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}, #read who author is but can't write who author is. SET BY BACKEND
        }

    def validate(self, data):
        if "start_time" not in data or data["start_time"] is None:
            request = self.context.get("request")
            user = request.user
            due_date= data.get("due_date")
            task_duration = data.get("duration")
            print(f"Task due Time: {due_date}") 
            newStartTime = calculate(task_duration, due_date, user=user)
            if not newStartTime:
                raise serializers.ValidationError("Unable to find a suitable time for the task.")
            data["start_time"] = newStartTime
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True, "required": True}} #accept password but dont send back, no one should see it.

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


