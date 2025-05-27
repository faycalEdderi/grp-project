from django.urls import path
from .views import (
    top_10_games,
    get_all_games_view,
    create_game_view,
    get_game_view,
    update_game_view,
    delete_game_view,
    filter_games_view
)

urlpatterns = [
    path('top10/', top_10_games, name='top_10_games'),
    path('all/', get_all_games_view, name='all_games'),
    path('create/', create_game_view, name='create_game'),
    path('<str:game_id>/', get_game_view, name='get_game'),
    path('<str:game_id>/update/', update_game_view, name='update_game'),
    path('<str:game_id>/delete/', delete_game_view, name='delete_game'),
    path('filter/<str:field>/<str:value>/', filter_games_view, name='filter_games'),


]
