from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.urls import reverse
from .models import Article
import json


def index(request):
    context = {
    #     'MAP_KEY': settings.MAP_KEY,
    }
    return render(request, 'app_tpnm/index.html', context)

def save_article(request):
    # data = json.loads(request.body)
    # print(data)
    return HttpResponse('saved')
