from django.http import HttpResponse
from django.utils import simplejson


def get_posts(request):
    posts = [{'author': 'foo', 'post': 'post1'},
        {'author': 'bar', 'post': 'post2'}]
    return HttpResponse(simplejson.dumps(posts), content_type="application/json")
