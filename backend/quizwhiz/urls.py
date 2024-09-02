from django.urls import path, include
from django.http import HttpResponse
from django.contrib import admin

def home_view(request):
    return HttpResponse("ok")

urlpatterns = [
    path('', home_view), 
    path('admin/', admin.site.urls),
    path('api/v1/', include('quiz.urls')),
]
