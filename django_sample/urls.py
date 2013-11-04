from django.conf.urls import patterns, include, url
# from django.contrib import admin

# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'django_sample.views.home', name='home'),
    # url(r'^django_sample/', include('django_sample.foo.urls')),

    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^csv/', include('import_csv.urls')),
    url(r'^json/', include('sw_json.urls', namespace='sw_json')),
    url(r'^twitter/', include('twitter.urls', namespace='twitter')),
    url(r'^snippets/', include('snippets.urls', namespace='snippets')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
)