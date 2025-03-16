
from django.contrib import admin
from django.urls import include, path
from scheduler.views import user_create
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include('scheduler.urls')), # used to be /api..
    path("user/create/", user_create, name="user_create"),
    path('token/', TokenObtainPairView.as_view(), name='obtain_token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='refresh_token'),
    path('user-auth/', include('rest_framework.urls')),
]
