from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017")
db = client["videogames_steam"]
collection = db["games_steam"]


def get_top_10_developers():
    pipeline = [
        {"$group": {"_id": "$Developer", "game_count": {"$sum": 1}}},
        {"$sort": {"game_count": -1}},
        {"$limit": 10}
    ]
    return list(collection.aggregate(pipeline))


def count_games_per_year():
    pipeline = [
        {"$group": {"_id": "$Year_of_Release", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    return list(collection.aggregate(pipeline))


def get_average_critic_score_by_genre():
    pipeline = [
        {
            "$group": {
                "_id": "$Genre",
                "average_critic_score": {"$avg": "$Critic_Score"},
                "count": {"$sum": 1}
            }
        },
        {"$sort": {"average_critic_score": -1}}
    ]
    return list(collection.aggregate(pipeline))


def count_games_by_rating():
    pipeline = [
        {"$group": {"_id": "$Rating", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    return list(collection.aggregate(pipeline))


def filter_games_by_min_global_sales(min_sales):
    query = {"Global_Sales": {"$gte": min_sales}}
    results = list(collection.find(query))
    for game in results:
        game["_id"] = str(game["_id"])
    return results
