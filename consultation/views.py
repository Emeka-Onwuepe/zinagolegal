from django.shortcuts import render
from django.core.mail import send_mail
from django.http import JsonResponse
import json

from consultation.models import Consultation


# Create your views here.
def consultationView(request):  
    
    data = json.loads(request.body.decode("utf-8"))
    action = data['action']
    del data['action']
    if action == 'create':
        Consultation.objects.create(**data)
        return JsonResponse({"message":"success"})
    if action == 'payment':
        orderId = data['orderId']
        consultation = Consultation.objects.get(orderId=orderId)
        consultation.paid = True
        consultation.save()
        # send_mail(
        #     'Consultation Payment Received',
        #     f'Hello {consultation.name},\n\nWe have received your payment for the {consultation.service} consultation scheduled on {consultation.date}. We will review your message and get back to you shortly.\n\nBest regards,\nZinago Legal Team',
        #     'admin@zinagolegal.com',

        # )
        return JsonResponse({"message":"success"})
    if action == 'delete':
        orderId = data['orderId']
        consultation = Consultation.objects.get(orderId=orderId)
        consultation.delete()
        return JsonResponse({"message":"success"})
