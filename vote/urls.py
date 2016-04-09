from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from vote import views
from django.conf.urls import include

urlpatterns = [
    url(r'^make_vote/$', views.VoteCreate.as_view())
]
