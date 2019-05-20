from django.urls import path, include
from django.conf.urls import url

from . import views
# from app_tpnm.views import LanguageAutocomplete

app_name = 'app_tpnm'
urlpatterns = [
    path('', views.index, name='index'),
    path('save_article/', views.save_article, name='save_article'),
    path('save_edit/', views.save_edit, name='save_edit'),
    # path('save_comment/', views.save_comment, name='save_comment'),
    path('get_article/', views.get_article, name='get_article'),
    path('about/', views.about, name='about'),
    path('accounts/', include('django.contrib.auth.urls')),
]
