from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings


def index(request):
    context = {
        'MAP_KEY': settings.MAP_KEY
    }
    return render(request, 'app_tpnm/index.html', context)

def indextest(request):
    return render (request, 'app_tpnm/indextest.html')
