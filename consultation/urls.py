from django.urls import path
from . import views


app_name="consultation"

urlpatterns = [
    
    path('consult',views.consultationView,name="consultationView"), 
    
]
