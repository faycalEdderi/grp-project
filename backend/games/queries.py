from pymongo import MongoClient
from bson import ObjectId


client = MongoClient("mongodb://localhost:27017")
db = client["videogames"]
collection = db["games"]


def get_all_games():
    games = list(collection.find())
    for game in games:
        game['_id'] = str(game['_id'])
    return games


def create_game(data):
    result = collection.insert_one(data)
    return str(result.inserted_id)


def get_game_by_id(game_id):
    game = collection.find_one({"_id": ObjectId(game_id)})
    if game:
        game['_id'] = str(game['_id'])
    return game


def update_game(game_id, updated_data):
    result = collection.update_one(
        {"_id": ObjectId(game_id)},
        {"$set": updated_data}
    )
    return result.modified_count


def delete_game(game_id):
    result = collection.delete_one({"_id": ObjectId(game_id)})
    return result.deleted_count

def get_top_10_games():
    return list(
        collection.find({}, {"_id": 0, "Name": 1, "Global_Sales": 1})
        .sort("Global_Sales", -1)
        .limit(10)
    )
