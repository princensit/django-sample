from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.views.generic import TemplateView
from rest_framework import generics, permissions, renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from twitter.helpers import deprecated
from twitter.models import Post
from twitter.permissions import IsOwnerOrReadOnly
from twitter.serializers import PostSerializer, UserSerializer


# TODO PRI 20131030 Following decorator works on function, figure out the same for class:
# Ref: http://code.activestate.com/recipes/391367-deprecated/
@deprecated
class LoginView(TemplateView):
    template_name = 'twitter/index.html'


@deprecated
class SignupView(TemplateView):
    template_name = 'twitter/signup.html'


@deprecated
class ProfileView(TemplateView):
    template_name = 'twitter/profile.html'


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def pre_save(self, obj):
        obj.owner = self.request.user


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly)

    def pre_save(self, obj):
        obj.owner = self.request.user


class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'posts': reverse('post-list', request=request, format=format)
    })


class PostHighlight(generics.GenericAPIView):
    queryset = Post.objects.all()
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        post = self.get_object()
        return Response(post.highlighted)
