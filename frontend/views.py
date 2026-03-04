from django.shortcuts import render

# Create your views here.
import json
import requests
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from consultation.models import Consultation_Meta,Services


# Create your views here.
def homeView(request):  
    return render(request,'frontend/index.html')

def ceoView(request): 
    return render(request,'frontend/ceo.html')

def servicesView(request):  
    return render(request,'frontend/services.html')

def consultView(request):  
    amount = Consultation_Meta.objects.first()
    services = Services.objects.all()

    return render(request,'frontend/consultation.html',
                  {"public_key":settings.PAYSTACT_PUBLIC_KEY,
                   'services':services,
                   'amount':amount.amount})

# def cartView(request): 
#     locations = Location.objects.all()
#     return render(request,'frontview/cart.html',{"public_key":settings.PAYSTACT_PUBLIC_KEY,
#                                                  "locations":locations})
   
def processPaymentView(request):
       if request.method == "POST":
           customer_instance = None
           sales = None
           sale_type = None
           data = json.loads(request.body.decode("utf-8"))
           
           if data['action'] == "payment":

               headers = {
                    "Authorization": f'Bearer {settings.PAYSTACT_SECRET_KEY}',
                        'Content-Type': 'application/json',
                }
               url = f'https://api.paystack.co/transaction/verify/{data["purchase_id"]}'
                
               response = requests.get(url,headers=headers)
                
               if response.status_code == 200:
                    # remeber to complete
                   return JsonResponse({"message":'success'})
