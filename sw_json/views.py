from django.shortcuts import render_to_response
from django\
    .utils import simplejson
from django.http import HttpResponse
from django.utils.datetime_safe import datetime


def index(request):
    now = datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html, content_type="text/html")


def get_response(request):
    response_data = {'name': 'Test user', 'age': 23}
    return HttpResponse(simplejson.dumps(response_data), content_type="application/json")


def submit(request, extra):
    response_data = [{'name': 'user1', 'age': 23, 'extra': extra},
                     {'name': 'user2', 'age': 25, 'extra': extra}]
    return render_to_response('sw_json/index.html', {'responses': response_data}, content_type="text/html")
