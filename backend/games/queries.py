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
    
def get_distinct_values(field_name):
    return collection.distinct(field_name)


def filter_games(field, value):
    allowed_fields = ["Platform", "Genre", "Publisher", "Year_of_Release"]
    if field not in allowed_fields:
        raise ValueError("Filtre non autorisé.")

    if field == "Year_of_Release":
        try:
            value = int(value)
        except ValueError:
            raise ValueError("L'année doit être un nombre.")

    results = list(collection.find({field: value}))
    for game in results:
        game["_id"] = str(game["_id"])
    return results


def filter_games_multiple(filters):
    allowed_fields = ["Platform", "Genre", "Publisher", "Year_of_Release"]
    query = {}

    for field, value in filters.items():
        if field not in allowed_fields:
            continue  # ignore les champs non autorisés
        if field == "Year_of_Release":
            try:
                value = int(value)
            except ValueError:
                continue  # ignore si mauvaise valeur
        query[field] = value

    results = list(collection.find(query))
    for game in results:
        game["_id"] = str(game["_id"])
    return results


def average_sales_by_platform():
    pipeline = [
        {
            "$group": {
                "_id": "$Platform",
                "average_sales": {"$avg": "$Global_Sales"},
                "total_sales": {"$sum": "$Global_Sales"},
                "game_count": {"$sum": 1}
            }
        },
        {
            "$sort": {"average_sales": -1}
        }
    ]
    results = list(collection.aggregate(pipeline))
    return results

