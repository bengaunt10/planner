from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}, #read who author is but can't write who author is. SET BY BACKEND
        "start_time": {"required": False}
        }

    # Check in documentation for these.. create normal django one?? or drf or where it at
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True, "required": True}} #accept password but dont send back, no one should see it.

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user