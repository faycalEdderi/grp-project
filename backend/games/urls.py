from django.urls import path
from .views import top_10_games

urlpatterns = [
    path('top10/', top_10_games, name='top_10_games'),
]
