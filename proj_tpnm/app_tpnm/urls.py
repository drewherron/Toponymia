from django.urls import path
from django.conf.urls import url

from . import views
# from app_tpnm.views import LanguageAutocomplete

app_name = 'app_tpnm'
urlpatterns = [
    path('', views.index, name='index'),
    path('save_article/', views.save_article, name='save_article'),
    path('get_article/', views.get_article, name='get_article'),
    path('about/', views.about, name='about'),
    # url(
    #     r'^language-autocomplete/$',
    #     LanguageAutocomplete.as_view(),
    #     name='language-autocomplete',
    # ),
]
