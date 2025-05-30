from bson import ObjectId
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["videogames"]
games_collection = db["games"]
reviews_collection = db["reviews"]


def get_all_games():
    games = list(games_collection.find())
    for game in games:
        game['_id'] = str(game['_id'])
    return games


def create_game(data):
    result = games_collection.insert_one(data)
    return str(result.inserted_id)


def get_game_by_id(game_id):
    game = games_collection.find_one({"_id": ObjectId(game_id)})
    if game:
        game['_id'] = str(game['_id'])
    return game


def update_game(obj_id, updated_data):
    print(f"Updating game with ID: {obj_id} with data: {updated_data}")
    result = games_collection.update_one(
        {"_id": ObjectId(obj_id)},
        {"$set": updated_data}
    )
    return result.modified_count

def delete_game(game_id):
    result = games_collection.delete_one({"_id": ObjectId(game_id)})
    return result.deleted_count

def get_top_10_games():
    return list(
        games_collection.find({}, {"_id": 0, "Name": 1, "Global_Sales": 1})
        .sort("Global_Sales", -1)
        .limit(10)
    )
    
def get_distinct_values(field_name):
    return games_collection.distinct(field_name)


def filter_games(field, value):
    allowed_fields = ["Platform", "Genre", "Publisher", "Year_of_Release"]
    if field not in allowed_fields:
        raise ValueError("Filtre non autorisé.")

    if field == "Year_of_Release":
        try:
            value = int(value)
        except ValueError:
            raise ValueError("L'année doit être un nombre.")

    results = list(games_collection.find({field: value}))
    for game in results:
        game["_id"] = str(game["_id"])
    return results


def filter_games_multiple(filters):
    allowed_fields = ["Platform", "Genre", "Publisher", "Year_of_Release"]
    query = {}

    for field, value in filters.items():
        if field not in allowed_fields:
            continue 
        if field == "Year_of_Release":
            try:
                value = int(value)
            except ValueError:
                continue 
        query[field] = value

    results = list(games_collection.find(query))
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
    results = list(games_collection.aggregate(pipeline))
    return results


def get_games_by_review_ratio(limit=10, sort_type="positive"):
    pipeline = [
        {"$match": {
            "positive": {"$ne": "\\N"},
            "negative": {"$ne": "\\N"},
            "total": {"$gt": 100} 
        }},
        
        {"$addFields": {
            "positive_num": {"$toInt": "$positive"},
            "negative_num": {"$toInt": "$negative"},
            "total_num": {"$toInt": "$total"}
        }},
        
        {"$addFields": {
            "positive_ratio": {"$divide": ["$positive_num", "$total_num"]},
            "negative_ratio": {"$divide": ["$negative_num", "$total_num"]}
        }},
        
        {"$sort": {
            f"{sort_type}_ratio": -1 if sort_type == "positive" else 1
        }},
        
        {"$limit": limit},
        
        {"$project": {
            "_id": 0,
            "app_id": 1,
            "name": 1,
            "positive": "$positive_num",
            "negative": "$negative_num", 
            "total": "$total_num",
            "positive_ratio": 1,
            "negative_ratio": 1,
            "review_score_description": 1
        }}
    ]
    
    results = list(reviews_collection.aggregate(pipeline))
    
    for game in results:
        game["positive_ratio"] = round(game["positive_ratio"] * 100, 2)
        game["negative_ratio"] = round(game["negative_ratio"] * 100, 2)
    
    return results

def get_games_by_reviews(limit=10, sort_type="positive"):
    pipeline = [
        {"$match": {
            "positive": {"$type": "number"},
            "negative": {"$type": "number"},
            "total": {"$gt": 10000}  # Minimum reviews threshold
        }},
        
        {"$addFields": {
            "positive_ratio": {"$divide": ["$positive", {"$add": ["$positive", "$negative"]}]},
        }},
        
        {"$sort": {
            "positive_ratio": -1 if sort_type == "positive" else 1
        }},
        
        {"$limit": limit},
        
        {"$project": {
            "_id": 0,
            "app_id": 1,
            "name": 1,
            "positive": 1,
            "negative": 1,
            "total": {"$add": ["$positive", "$negative"]},
            "positive_ratio": 1,
            "review_score_description": 1
        }}
    ]
    
    results = list(reviews_collection.aggregate(pipeline))
    
    for game in results:
        game["positive_ratio"] = round(game["positive_ratio"] * 100, 2)
        game["negative_ratio"] = 100 - game["positive_ratio"]
    
    return results

def get_paginated_games(page=1, per_page=10, filters=None):
    query = filters if filters else {}
    skip = (page - 1) * per_page

    total = games_collection.count_documents(query)
    games = list(
        games_collection.find(query).skip(skip).limit(per_page)
    )
    for game in games:
        game["_id"] = str(game["_id"])

    return {
        "games": games,
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }