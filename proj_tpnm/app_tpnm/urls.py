from django.urls import path

from . import views

app_name = 'app_tpnm'
urlpatterns = [
    path('', views.index, name='index'),
    path('new_article/', views.new_article, name='new_article'),
    path('edit_article/', views.edit_article, name='edit_article'),
    path('indextest/', views.indextest, name='indextest'),
    path('save_article/', views.save_article, name='save_article'),
]
