from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from songs import views
from django.conf.urls import include

urlpatterns = [
    url(r'^all_songs/$', views.SongList.as_view()),
]
