from django.db import models

# Create your models here.

class Consultation(models.Model):
    """Model definition for Consultation."""

    # TODO: Define fields here
    orderId = models.CharField("orderId", max_length=50)
    name = models.CharField("name", max_length=100)
    email = models.CharField("email", max_length=50)
    phone = models.CharField("phone", max_length=50)
    service = models.CharField("service", max_length=100)
    date = models.DateField("date", auto_now=False, auto_now_add=False)
    description = models.TextField("description")
    paid = models.BooleanField("paid",default=False)
    created = models.DateTimeField(auto_now=True)
    done = models.BooleanField("done",default=False)


    class Meta:
        """Meta definition for Consultation."""

        verbose_name = 'Consultation'
        verbose_name_plural = 'Consultations'
        ordering = ['-date']

    def __str__(self):
        """Unicode representation of Consultation."""
        return f'{self.name} - {self.service} - {self.created}'
        

class Consultation_Meta(models.Model):
    """Model definition for Consultation_Meta."""

    # TODO: Define fields here
    amount = models.IntegerField()

    class Meta:
        """Meta definition for Consultation_Meta."""

        verbose_name = 'Consultation_Meta'
        verbose_name_plural = 'Consultation_Metas'

    def __str__(self):
        """Unicode representation of Consultation_Meta."""
        return str(self.amount)

class Services(models.Model):
    """Model definition for services."""

    # TODO: Define fields here
    name = models.CharField("name", max_length=150)

    class Meta:
        """Meta definition for services."""

        verbose_name = 'services'
        verbose_name_plural = 'servicess'

    def __str__(self):
        """Unicode representation of services."""
        return self.name


