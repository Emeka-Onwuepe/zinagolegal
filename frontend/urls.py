from django.urls import path
from .import views


app_name="frontend"

urlpatterns = [
    
    path('',views.homeView,name="homeView"), 
    path('services',views.servicesView,name="servicesView"), 
    path('ceo',views.ceoView,name="ceoView"), 
    path('bookconsultation',views.consultView,name="bookConsultation"), 

    
]
