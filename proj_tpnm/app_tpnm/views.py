from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.urls import reverse
from .models import Article
import json


def index(request):
    # marker_locations = Article.objects.get()
    # post_json = json.loads(request.body)
    context = {
    #     'MAP_KEY': settings.MAP_KEY,
    }
    return render(request, 'app_tpnm/index.html', context)

def save_article(request):
    data = json.loads(request.body)
    print(data)
    # text = data['text']
    # ajax_demo_data = Article(title=title, etc)
    return HttpResponse('saved')

def new_article(request):
    print(request.body)
    return render (request, 'app_tpnm/create.html')
    # return HttpResponseRedirect(reverse('app_tpnm:index'))

def edit_article(request):
    context = {
        'message': 'test_message',
    }
    return render (request, 'app_tpnm/edit.html', context)

def indextest(request):
    return render (request, 'app_tpnm/indextest.html')
