from rest_framework import serializers
from api.models import NewsletterSubscriber
class CommentSerializer(serializers.Serializer): 

    email = serializers.EmailField()
    message = serializers.CharField()
    # name = serializers.CharField()


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    # owner=serializers.ReadOnlyField(source='user.email')
    class Meta:
        model = NewsletterSubscriber
        fields = ('name','email_address')