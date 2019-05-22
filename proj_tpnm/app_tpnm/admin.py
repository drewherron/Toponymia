from django.contrib import admin
from .models import Article, ArticleName, Edit, Language, Comment

admin.site.register(Article)
admin.site.register(ArticleName)
admin.site.register(Edit)
admin.site.register(Language)
admin.site.register(Comment)
