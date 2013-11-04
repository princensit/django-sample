from django.db import models
from twitter.helpers import deprecated


@deprecated
class Profile(models.Model):
    name = models.CharField(max_length=300, null=True, blank=False)
    email = models.EmailField()
    age = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __unicode__(self):
        return self.name + ' ' + self.email + '' + str(self.age)

    class Meta:
        ordering = ['-timestamp', ]


class Post(models.Model):
    post = models.CharField(max_length=300, null=True, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('auth.User', related_name='posts')

    class Meta:
        ordering = ['-timestamp', ]
