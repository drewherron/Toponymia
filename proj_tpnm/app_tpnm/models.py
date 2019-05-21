from django.db import models
from django.contrib.postgres.fields import JSONField, ArrayField
from django import forms


class Article(models.Model):
    tpnm_id = models.CharField(max_length=500)
    mapbox_id = models.PositiveIntegerField(blank=True, null=True)
    title = models.CharField(max_length=1000)
    named_id = models.CharField(max_length=1000)
    # coordinates = ArrayField(ArrayField(models.DecimalField(max_digits=22, decimal_places=16)))
    longitude = models.DecimalField(
        max_digits=22, decimal_places=16, blank=False, null=False)
    latitude = models.DecimalField(
        max_digits=22, decimal_places=16, blank=False, null=False)
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

    def toDictionary(self):
        r = {
            'title': self.title,
            'longitude': self.longitude,
            'latitude': self.latitude,
            'coordinates': [self.longitude, self.latitude],
            'class': self.place_class,
            'type': self.place_type,
            'geo_type': self.geo_type,
            'iso_3166_1': self.iso_3166_1,
            'iso_3166_2': self.iso_3166_2,
            'id': self.id,
            'tpnm_id': self.tpnm_id,
            'named_id': self.named_id,
            'created': self.created,
            'created_by': self.created_by,
            'toponyms': [],
        }
        for article_name in self.article_names.all():
            r['toponyms'].append(article_name.toDictionary())
        return r

    def __str__(self):
        return self.title + ' ' + self.tpnm_id


class ArticleName(models.Model):
    tpnm_id = models.CharField(max_length=500)
    article = models.ForeignKey('Article', related_name='article_names', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, blank=False, null=False)

    class Meta:
        unique_together = ["tpnm_id", "name"]

    def __str__(self):
        return self.article.title + ' ' + self.name

    def toDictionary(self):
        r = {
            'name': self.name,
            'edits': [],
        }
        for edit in self.edits.all():
            r['edits'].append(edit.toDictionary())
        return r


class Edit(models.Model):
    article_name = models.ForeignKey(
        'ArticleName', related_name='edits', on_delete=models.CASCADE)
    in_language = ArrayField(
        models.CharField(max_length=250, blank=True), default=list, size=250, null=True, blank=True)
    from_language = ArrayField(
        models.CharField(max_length=250, blank=True), default=list, size=50, null=True, blank=True)
    content = models.TextField()
    endonym = models.NullBooleanField()
    reference = ArrayField(
        models.CharField(max_length=500, blank=True), default=list, size=50, null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    derived_term = models.CharField(max_length=200, blank=True, null=True)
    derived_url = models.URLField(max_length=200, blank=True, null=True)
    see_also = ArrayField(
        models.CharField(max_length=500, blank=True), default=list, size=50, null=True, blank=True)
    username = models.CharField(max_length=200)

    def __str__(self):
        return self.article_name.name + ' Edit' + str(self.id)

    def toDictionary(self):
        return {
            'in_language': self.in_language,
            'from_language': self.from_language,
            'endonym': self.endonym,
            'content': self.content,
            'created': self.created,
            'edited': self.edited,
            'username': self.username,
            'reference': self.reference,
            'see_also': self.see_also,
        }


class Comment(models.Model):
    article = models.ForeignKey(
        'Comment', related_name='categories', on_delete=models.CASCADE)
    username = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    content = models.TextField()
    reported = models.PositiveSmallIntegerField(blank=True, null=True)

    def __str__(self):
        return self.article + ' ' + self.username + ' ' + str(self.created)

# class CommentCategory(model.Models):
#     article = models.ForeignKey('Article', related_name='comments', on_delete=models.CASCADE)
#     category_name = models.CharField(max_length=200)
#     created = models.DateTimeField(auto_now_add=True)
#     edited = models.DateTimeField(auto_now=True)
#     content = models.TextField()
#     username = models.CharField(max_length=200)
#
#     def __str__(self):
#         return self.article +' '+ self.username +' '+ str(self.created)


class Language(models.Model):
    iso_639_3 = models.CharField(max_length=3)
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name + ' (' + self.iso_639_3 + ')'

# class Users:
#     id = models.AutoField(primary_key=True)
#     username = models.CharField(max_length=30)
#     # favorites = ????
#     email = models.EmailField()
#
#     def __str__(self):
#             return self.username
