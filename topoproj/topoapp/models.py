from django.db import models
from django.contrib.postgres.fields import JSONField

class Articles(models.Model):
    title = models.CharField(max_length=200)
    data = models.JSONField()
    created_by = models.CharField(max_length=50)
    created = models.DateField(auto_now_add=True)
    edited = models.DateField(auto_now=True)
    reported = models.CharField(max_length=200)
    reported_by = models.CharField(max_length=200)

class Edits:
    article_id = models.ForeignKey('Articles', on_delete=models.CASCADE).
    language = forms.CharField(max_length=3)
    content = forms.CharField()
    reference = forms.URLField(label='Reference', required=False)
    edit_time = models.DateTimeField(auto_now=True)
    author = models.CharField(max_length=200)

class Languages:
    iso_639_3 = models.CharField(max_length=3)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

# class Users:
#     username = models.CharField(max_length=30)
#     email = models.EmailField()
#         def __str__(self):
#             return self.user_name
