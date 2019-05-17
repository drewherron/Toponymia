from django.db import models
from django.contrib.postgres.fields import JSONField, ArrayField
from django import forms

class Article(models.Model):
    tpnm_id = models.CharField( max_length=500)
    mapbox_id = models.PositiveIntegerField(blank=True, null=True)
    title = models.CharField(max_length=1000)
    named_id = models.CharField(max_length=1000)
    # coordinates = ArrayField(ArrayField(models.DecimalField(max_digits=22, decimal_places=16)))
    longitude = models.DecimalField(max_digits=22, decimal_places=16, blank=False, null=False)
    latitude = models.DecimalField(max_digits=22, decimal_places=16, blank=False, null=False)
    iso_3166_1 = models.CharField(max_length=50, blank=True, null=True)
    iso_3166_2 = models.CharField(max_length=50, blank=True, null=True)
    place_class = models.CharField(max_length=200, blank=True, null=True)
    place_type = models.CharField(max_length=200, blank=True, null=True)
    geo_type = models.CharField(max_length=200, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=50)
    favorited = models.PositiveIntegerField(blank=True, null=True)
    favorited_by = models.CharField(max_length=200, blank=True, null=True)
    reported = models.CharField(max_length=200, blank=True, null=True)
    reported_by = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return self.title + ' ' + self.tpnm_id


class Edit(models.Model):
    article = models.ForeignKey('Article', related_name='edits', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=False, null=False)
    in_language = models.CharField(max_length=200, blank=False, null=False)
    # from_language = models.CharField(max_length=200, blank=True, null=True)
    from_language = ArrayField(
        models.CharField(max_length=3, blank=True), default=list, size=5, null=True, blank=True)
    content = models.TextField()
    endonym = models.NullBooleanField()
    reference = models.CharField(max_length=2500, blank=True, null=True)
    reference_url = models.URLField(max_length=200, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    derived_term = models.CharField(max_length=200, blank=True, null=True)
    derived_url = models.URLField(max_length=200, blank=True, null=True)
    see_also_title = models.CharField(max_length=200, blank=True, null=True)
    see_also_url = models.URLField(max_length=200, blank=True, null=True)
    username = models.CharField(max_length=200)

    def __str__(self):
        return self.article.title + ' Edit' + str(self.id)


class Comment(models.Model):
    article = models.ForeignKey('Article', on_delete=models.CASCADE)
    username = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    content = models.TextField()
    reported = models.PositiveSmallIntegerField(blank=True, null=True)


    def __str__(self):
        return self.article +' '+ self.username +' '+ str(self.created)

class Language(models.Model):
    iso_639_3 = models.CharField(max_length=3)
    name = models.CharField(max_length=200)

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
