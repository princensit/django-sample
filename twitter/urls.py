from django.conf.urls import patterns, url
from rest_framework.urlpatterns import format_suffix_patterns

from twitter import views

urlpatterns = patterns('',
    # url('^$', LoginView.as_view(), name='login'),
    # url('^signup/$', SignupView.as_view(), name='signup'),
    # url('^profile/$', ProfileView.as_view(), name='profile'),
    # url('^posts/$', service.get_posts, name='posts'),

    url(r'^$', views.api_root),
    url(r'^posts/$', views.PostList.as_view(), name='post-list'),
    url(r'^posts/(?P<pk>[0-9]+)/$', views.PostDetail.as_view(), name='post-detail'),
    url(r'^users/$', views.UserList.as_view(), name='user-list'),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view(), name='user-detail'),
)

urlpatterns = format_suffix_patterns(urlpatterns)
