from django.contrib.auth.models import User
from rest_framework import serializers
from twitter.models import Post


class PostSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.Field(source='owner.username')
    # post = serializers.HyperlinkedIdentityField(view_name='post-detail', format='html')

    class Meta:
        model = Post
        fields = ('owner', 'post')


class UserSerializer(serializers.HyperlinkedModelSerializer):
    # posts = serializers.PrimaryKeyRelatedField(many=True)
    posts = serializers.HyperlinkedRelatedField(many=True, view_name='post-detail')

    class Meta:
        model = User
        fields = ('username', 'posts')
