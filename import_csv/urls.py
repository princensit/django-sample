from django.conf.urls import patterns, url
import views

urlpatterns = patterns('',
    url('^$', views.get_csv, name='csv'),
)
