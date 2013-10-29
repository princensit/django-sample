from django.http import HttpResponse
from django.utils.datetime_safe import datetime


def index(request):
    now = datetime.now()
    html = "<html><body><h1>Twitter work going on!</h1><br>It is now {time}.</body></html>".format(time=now)
    return HttpResponse(html)


def login(request):
    print 'login'
    return HttpResponse('TODO: login page')


def signup(request):
    return HttpResponse('TODO: signup page')


def profile(request):
    return HttpResponse('TODO: profile page')
