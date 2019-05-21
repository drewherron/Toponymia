from django.shortcuts import render, reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.conf import settings
from django.urls import reverse
from .models import Article, ArticleName, Edit, Comment, Language
from django.contrib.auth.decorators import login_required
import json
# from dal import autocomplete


def index(request):
    context = {
        #     'MAP_KEY': settings.MAP_KEY,
        'languages': Language.objects.all(),
        'articles': Article.objects.all().order_by('-latitude'),
    }
    return render(request, 'app_tpnm/index.html', context)

def usermap(request):
    context = {
        #     'MAP_KEY': settings.MAP_KEY,
        'languages': Language.objects.all(),
        'articles': Article.objects.all().order_by('-latitude'),
    }
    return render(request, 'app_tpnm/usermap.html', context)

def get_article(request):
    data = json.loads(request.body)
    print(data)
    # current_id = data['id']
    articles = Article.objects.filter(tpnm_id=data['tpnm_id'])
    # article_names = ArticleName.objects.filter(article__tpnm_id=data['tpnm_id']).order_by('id')
    # edits = Edit.objects.filter(article_name__id=article_names.id).order_by('edited')
    jsondata = {'properties': []}
    for article in articles:
        jsondata['properties'].append(article.toDictionary())
    # for article_name in article.article_names.all():
    # for article_name in article_names:
    #     jsondata['features'][0]['toponyms'].append(article_name.toDictionary())
    #     for edit in article_name.edits.all():
    #         n = 0
    #         jsondata['features'][0]['toponyms'][n]['article'].append(edit.toDictionary())
    # print(jsondata['features'])
    print(jsondata)
    return JsonResponse(jsondata)

@login_required
def save_article(request):
    tpnm_id = request.POST['tpnm-id-field']
    mapbox_id = request.POST['mapbox-id-field']
    # coordinates = {request.POST['coord-field']}
    title = request.POST['title-field']
    longitude = request.POST['long-field']
    latitude = request.POST['lat-field']
    place_class = request.POST['place-class-field']
    place_type = request.POST['place-type-field']
    geo_type = request.POST['geo-type-field']
    iso_3166_1 = request.POST['iso-3166-1-field']
    iso_3166_2 = request.POST['iso-3166-2-field']
    named_id = title + ' id:' + str(mapbox_id)
    name = request.POST['name-field']
    in_language = request.POST.getlist('inlang-multiselect')
    from_language = request.POST.getlist('fromlang-multiselect')
    endonym = request.POST['endonym']
    content = request.POST['form-content']
    reference = request.POST.getlist('reference-field')
    username = request.user.get_username()
    print(request.POST)
    article = Article(tpnm_id=tpnm_id, mapbox_id=mapbox_id, named_id=named_id, title=title, longitude=longitude, latitude=latitude,
                      place_class=place_class, place_type=place_type, geo_type=geo_type, iso_3166_1=iso_3166_1, iso_3166_2=iso_3166_2)
    article.save()
    article_name = ArticleName(tpnm_id=tpnm_id, article=article, name=name)
    article_name.save()
    edit = Edit(article_name=article_name, in_language=in_language,
                from_language=from_language, endonym=endonym, content=content, reference=reference, username=username)
    edit.save()

    return HttpResponseRedirect(reverse('app_tpnm:index'))

@login_required
def save_edit(request):
    id = request.POST['id-field']
    tpnm_id = request.POST['edit-tpnm-id-field']
    article = Article.objects.get(id=id)
    name = request.POST['edit-name-field']
    in_language = request.POST.getlist('edit-inlang-multiselect')
    from_language = request.POST.getlist('edit-fromlang-multiselect')
    endonym = request.POST['edit-endonym']
    content = request.POST['edit-form-content']
    reference = request.POST.getlist('edit-reference-field')
    username = request.user.get_username()
    see_also = request.POST.getlist('edit-see-also')
    article_name = ArticleName(tpnm_id=tpnm_id, article=article, name=name)
    article_name.save()
    edit = Edit(article_name = article_name, in_language=in_language,
                from_language=from_language, endonym=endonym, content=content, reference=reference, username=username, see_also=see_also)
    edit.save()
    return HttpResponseRedirect(reverse('app_tpnm:index'))

def about(request):
    context = {
    }
    return render(request, 'app_tpnm/about.html', context)

# def save_comment(request):
#     if request.method == 'POST':
#         post_text = request.POST.get('the_post')
#         response_data = {}
#
#         post = Post(text=post_text, author=request.user)
#         post.save()
#
#         response_data['result'] = 'Create post successful!'
#         response_data['postpk'] = post.pk
#         response_data['text'] = post.text
#         response_data['created'] = post.created.strftime('%B %d, %Y %I:%M %p')
#         response_data['author'] = post.author.username
#
#         return HttpResponse(
#             json.dumps(response_data),
#             content_type="application/json"
#         )
#     else:
#         return HttpResponse(
#             json.dumps({"nothing to see": "this isn't happening"}),
#             content_type="application/json"
#         )
# class LanguageAutocomplete(autocomplete.Select2QuerySetView):
#     def get_queryset(self):
#
#         qs = Language.objects.all()
#
#         if self.q:
#             qs = qs.filter(name__icontains=self.q)
#
#         return qs
