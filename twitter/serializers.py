from django.contrib.auth.models import User
from rest_framework import serializers
from twitter.models import Post


class PostSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.Field(source='owner.username')
    highlight = serializers.HyperlinkedIdentityField(view_name='post-highlight', format='html')

    class Meta:
        model = Post
        fields = ('id', 'post', 'owner', 'url')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    # posts = serializers.PrimaryKeyRelatedField(many=True)
    posts = serializers.HyperlinkedRelatedField(many=True, view_name='post-detail')

    class Meta:
        model = User
        fields = ('id', 'username', 'posts', 'url')
