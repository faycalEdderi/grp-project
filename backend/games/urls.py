from django.urls import path
from .views import (
    top_10_games,
    get_all_games,
    create_game,
    get_game_by_id,
    update_game,
    delete_game,
)

urlpatterns = [
    path('top10/', top_10_games, name='top_10_games'),
    path('games/', get_all_games, name='all_games'),
    path('games/create/', create_game, name='create_game'),
    path('games/<str:game_id>/', get_game_by_id, name='get_game'),
    path('games/<str:game_id>/update/', update_game, name='update_game'),
    path('games/<str:game_id>/delete/', delete_game, name='delete_game'),
]
