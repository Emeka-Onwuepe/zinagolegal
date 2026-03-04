from django.contrib import admin
from .models import Consultation,Consultation_Meta,Services

# Register your models here.
# list view
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['name', 'service', 'paid', 'done', 'created']
    list_filter = ['done', 'paid', 'service']
    search_fields = ['name', 'orderId']

admin.site.register(Consultation,ConsultationAdmin)
admin.site.register(Consultation_Meta)
admin.site.register(Services)