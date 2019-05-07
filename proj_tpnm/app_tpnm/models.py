from django.db import models
from django.contrib.postgres.fields import JSONField, ArrayField
from django import forms


class Article(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    coordinates = ArrayField(ArrayField(models.FloatField()))
    longitude = models.FloatField()
    latitude = models.FloatField()
    data = JSONField()
    place_class = models.CharField(max_length=200, blank=True, null=True)
    place_type = models.CharField(max_length=200, blank=True, null=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    name_en = models.CharField(max_length=200, blank=True, null=True)
    mapbox_id = models.PositiveIntegerField(blank=True, null=True)
    place_type = models.CharField(max_length=200, blank=True, null=True)
    created_by = models.CharField(max_length=50)
    created = models.DateField(auto_now_add=True)
    favorited = models.PositiveIntegerField(blank=True, null=True)
    favorited_by = models.CharField(max_length=200, blank=True, null=True)
    reported = models.CharField(max_length=200, blank=True, null=True)
    reported_by = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.title + str(self.id)


class Edit(models.Model):
    id = models.AutoField(primary_key=True)
    article = models.ForeignKey('Article', on_delete=models.CASCADE)
    in_language = models.ForeignKey(
        'Language', blank=False, null=True, on_delete=models.SET_NULL)
    from_language = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField()
    reference = models.CharField(max_length=2500, blank=True, null=True)
    reference_url = models.URLField(max_length=200, blank=True, null=True)
    edited = models.DateTimeField(auto_now=True)
    derived_term = models.CharField(max_length=200, blank=True, null=True)
    derived_url = models.URLField(max_length=200, blank=True, null=True)
    see_also_title = models.CharField(max_length=200, blank=True, null=True)
    see_also_link = models.URLField(max_length=200, blank=True, null=True)
    username = models.CharField(max_length=200)

    def __str__(self):
        return self.article + ' Edit' + str(self.id)


class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    article = models.ForeignKey('Article', on_delete=models.CASCADE)
    username = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    content = models.TextField()
    reported = models.PositiveSmallIntegerField(blank=True, null=True)


    def __str__(self):
        return self.username +' '+ str(self.created)

class Language(models.Model):
    id = models.PositiveSmallIntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    iso_639_3 = models.CharField(max_length=3)
    glottocode = models.CharField(max_length=8)
    macroarea = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.name + ' (' + self.iso_639_3 +')'

# class Users:
#     id = models.AutoField(primary_key=True)
#     username = models.CharField(max_length=30)
#     # favorites = ????
#     email = models.EmailField()
#
#     def __str__(self):
#             return self.username
