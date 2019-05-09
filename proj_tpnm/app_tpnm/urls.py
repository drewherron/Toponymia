from django.urls import path

from . import views

app_name = 'app_tpnm'
urlpatterns = [
    path('', views.index, name='index'),
    path('save_article/', views.save_article, name='save_article'),
]
