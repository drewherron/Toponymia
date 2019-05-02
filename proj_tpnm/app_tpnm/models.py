from django.db import models
from django.contrib.postgres.fields import JSONField
from django import forms


class Articles(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    data = JSONField()
    created_by = models.CharField(max_length=50)
    created = models.DateField(auto_now_add=True)
    edited = models.DateField(auto_now=True)
    favorite = models.PositiveSmallIntegerField()
    reported = models.CharField(max_length=200)
    reported_by = models.CharField(max_length=200)


class Edits:
    id = models.AutoField(primary_key=True)
    article_id = models.ForeignKey('Articles.id', on_delete=models.CASCADE)
    language = models.CharField(max_length=3)
    content = models.CharField()
    reference = models.CharField(max_length=2500)
    edit_time = models.DateTimeField(auto_now=True)
    author = models.CharField(max_length=200)

class Languages:
    id = models.AutoField(primary_key=True)
    iso_639_3 = models.CharField(max_length=3)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


# class Users:
#     id = models.AutoField(primary_key=True)
#     username = models.CharField(max_length=30)
#     # favorites = ????
#     email = models.EmailField()
#
#     def __str__(self):
#             return self.username
