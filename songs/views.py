from django.shortcuts import render
# Create your views here.
import json
from django.http import HttpResponse

def all_songs(request):
    data = {'foo': 'bar', 'hello': 'world'}
    return HttpResponse(json.dumps(data), content_type='application/json')
