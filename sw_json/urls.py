from django.conf.urls import patterns, url
import views

urlpatterns = patterns('',
    url('^$', views.index, name='index'),
    url('^test/$', views.get_response, name='json_response'),
    url('^submit/(?P<extra>.*)/$', views.submit, name='submit_response'),
)
