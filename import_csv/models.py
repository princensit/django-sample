from csvImporter.model import CsvModel, CsvDbModel
from csvImporter.fields import *
from django.db import models


class DataSource(models.Model):
    name = models.IntegerField()
    mapped_age_groups = models.CharField(max_length=300)

    # class Meta:
    #     delimiter = ";"


class Attribute(models.Model):
    name = models.IntegerField()
    mapped_age_groups = models.CharField(max_length=300)


class MyCSvModel(CsvModel):
    name = IntegerField()
    mapped_age_groups = CharField(multiple=True)

    class Meta:
        delimiter = ','
        has_header = True


class MyCSvModel2(CsvDbModel):
    class Meta:
        delimiter = ','
        has_header = True
        dbModel = Attribute
