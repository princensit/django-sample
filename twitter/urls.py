from django.conf.urls import patterns, url
import views

urlpatterns = patterns('',
    url('^$', views.index, name='index'),
    url('^login/$', views.login, name='login'),
    url('^signup/$', views.signup, name='signup'),
    url('^profile/$', views.profile, name='profile'),
)
