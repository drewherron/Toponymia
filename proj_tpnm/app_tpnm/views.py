from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.urls import reverse
from .models import Article


def index(request):
    marker_locations = Article.objects.get()
    context = {
        'MAP_KEY': settings.MAP_KEY,
    }
    return render(request, 'app_tpnm/index.html', context)

def create(request):
    print(request.POST)
    return render (request, 'app_tpnm/create.html')
    # return HttpResponseRedirect(reverse('app_tpnm:index'))

def edit(request):
    context = {
        'message': 'test_message',
    }
    return render (request, 'app_tpnm/edit.html', context)

def indextest(request):
    return render (request, 'app_tpnm/indextest.html')
