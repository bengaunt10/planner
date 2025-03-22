from rest_framework import serializers
from .models import Task
from django.contrib.auth.models import User

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}, #read who author is but can't write who author is. SET BY BACKEND


        }
  
#anoither serializer based on another model. 
#use start time instead of due date... still send through start time... check it through with calculate passing start time as due date. just change the label in input box?
#ask paulo about serializer issue - issue when sending no start time, how to organise that in views and frotend? 
#as i did before where calculated start time before calling serializer.... tho cos it wasnt serialized and i used the non serializer values like before due date was in model i just did data.get and it was
#a string.. ooooohhh do json response o whoops i forgot about that..but then that defeats serializer purpose so maybe paulo can heklp with serializer thing. 


    # Check in documentation for these.. create normal django one?? or drf or where it at
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True, "required": True}} #accept password but dont send back, no one should see it.

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

        