from rest_framework.decorators import api_view
from rest_framework.response import Response
from .queries import get_top_10_games

@api_view(['GET'])
def top_10_games(request):
    games = get_top_10_games()
    return Response(games)
