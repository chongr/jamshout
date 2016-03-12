from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^all_songs$', views.all_songs, name='all_songs'),
]
