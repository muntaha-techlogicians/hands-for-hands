from django.db import models

class NewsletterSubscriber(models.Model):

    name = models.CharField(max_length=255)
    email_address = models.CharField(max_length=255)

    class Meta:
        db_table="newsletter_subscribers"