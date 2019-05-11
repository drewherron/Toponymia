from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.urls import reverse
from .models import Article, Language
import json
from dal import autocomplete

def index(request):
    context = {
    #     'MAP_KEY': settings.MAP_KEY,
    'languages': Language.objects.all()
    }
    return render(request, 'app_tpnm/index.html', context)

def save_article(request):
    # data = json.loads(request.body)
    # print(data)
    return HttpResponse('saved')

class LanguageAutocomplete(autocomplete.Select2QuerySetView):
    def get_queryset(self):

        qs = Language.objects.all()

        if self.q:
            qs = qs.filter(name__icontains=self.q)

        return qs
