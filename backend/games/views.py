from bson.errors import InvalidId
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .queries import (average_sales_by_platform, create_game, delete_game,
                      filter_games_multiple, get_all_games,
                      get_distinct_values, get_game_by_id,
                      get_games_by_reviews, get_paginated_games,
                      get_top_10_games, update_game)


@api_view(['GET'])
def top_10_games(request):
    games = get_top_10_games()
    return Response(games)

@api_view(['GET'])
def get_all_games_view(request):
    games = get_all_games()
    return Response(games)

@api_view(['POST'])
def create_game_view(request):
    try:
        data = request.data
        inserted_id = create_game(data)
        return Response({'inserted_id': inserted_id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_game_view(request, game_id):
    game = get_game_by_id(game_id)
    if game:
        return Response(game)
    return Response({'error': 'Game not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
def update_game_view(request, game_id):
    try:
        updated_data = dict(request.data)
        if '_id' in updated_data:
            del updated_data['_id']

        modified_count = update_game(game_id, updated_data)
        return Response({'modified': modified_count})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_game_view(request, game_id):
    try:
        deleted_count = delete_game(game_id)
        return Response({'deleted': deleted_count})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def filter_games_view(request):
    filters = {}
    allowed_fields = ['Platform', 'Genre', 'Publisher', 'Year_of_Release']

    for key in allowed_fields:
        value = request.query_params.get(key)
        if value:
            if key == 'Year_of_Release':
                try:
                    value = int(value)
                except ValueError:
                    return Response({'error': 'Year_of_Release must be an integer'}, status=status.HTTP_400_BAD_REQUEST)
            filters[key] = value

    try:
        games = filter_games_multiple(filters)
        return Response(games)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_distinct_field_values(request, field_name):
    try:
        values = get_distinct_values(field_name)
        return Response(values)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def average_sales_view(request):
    try:
        results = average_sales_by_platform()
        return Response(results)
    except Exception as e:
        return Response({'error': str(e)}, status=400)


@api_view(['GET'])
def paginated_games_view(request):
    try:
        page = int(request.query_params.get("page", 1))
        per_page = int(request.query_params.get("per_page", 10))

        filters = {}
        for field in ['Platform', 'Genre', 'Publisher', 'Year_of_Release']:
            value = request.query_params.get(field)
            if value:
                if field == "Year_of_Release":
                    try:
                        value = int(value)
                    except ValueError:
                        return Response({'error': 'Year must be int'}, status=400)
                filters[field] = value

        data = get_paginated_games(page, per_page, filters)
        return Response(data)

    except Exception as e:
        return Response({'error': str(e)}, status=400)
@api_view(['GET'])
def get_review_analytics(request):
    """
    API endpoint to get games with best/worst review scores based on simple positive/negative ratio
    """
    limit = int(request.GET.get('limit', 10))
    sort_type = request.GET.get('sort_type', 'positive')
    
    if sort_type not in ['positive', 'negative']:
        return Response({"error": "sort_type must be 'positive' or 'negative'"}, status=400)
    
    games = get_games_by_reviews(limit=limit, sort_type=sort_type)
    return Response(games)

