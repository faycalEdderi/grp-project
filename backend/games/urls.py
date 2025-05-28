from django.urls import path
from .views import (
    top_10_games,
    get_all_games_view,
    create_game_view,
    get_game_view,
    update_game_view,
    delete_game_view,
    filter_games_view,
    get_distinct_field_values,
    average_sales_view,
    paginated_games_view
)

urlpatterns = [
    path('top10/', top_10_games, name='top_10_games'),
    path('all/', get_all_games_view, name='all_games'),
    path('create/', create_game_view, name='create_game'),
    path('analytics/average-sales/', average_sales_view, name='average_sales'),
    path("paginated/", paginated_games_view),


    
    path('filter/', filter_games_view, name='filter_games'),
    path('distinct/<str:field_name>/', get_distinct_field_values, name='distinct_field'),

    path('<str:game_id>/', get_game_view, name='get_game'),
    path('<str:game_id>/update/', update_game_view, name='update_game'),
    path('<str:game_id>/delete/', delete_game_view, name='delete_game'),

]


