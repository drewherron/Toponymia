from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request, 'topoapp/index.html')

def psql(request):
    return render(request, 'topoapp/psql.html')
