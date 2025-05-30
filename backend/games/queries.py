from bson import ObjectId
from pymongo import MongoClient

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


def update_game(obj_id, updated_data):
    print(f"Updating game with ID: {obj_id} with data: {updated_data}")
    result = collection.update_one(
        {"_id": ObjectId(obj_id)},
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
            continue 
        if field == "Year_of_Release":
            try:
                value = int(value)
            except ValueError:
                continue 
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


def get_games_by_review_ratio(limit=10, sort_type="positive"):
    """
    Retrieve games with the best/worst review ratios from the reviews collection.
    
    Args:
        limit (int): Number of games to return
        sort_type (str): Whether to sort by "positive" or "negative" ratio
    
    Returns:
        List of games with their review statistics
    """
    client = MongoClient("mongodb+srv://amalplancher:amalplancher@cluster0.nty7qvb.mongodb.net/covid?retryWrites=true&w=majority")
    db = client["videogames"]
    collection = db["reviews"]
    
    # Create pipeline for MongoDB aggregation
    pipeline = [
        # Filter out entries with no reviews
        {"$match": {
            "positive": {"$ne": "\\N"},
            "negative": {"$ne": "\\N"},
            "total": {"$gt": 100}  # Ensure sufficient review volume
        }},
        
        # Convert string fields to numbers if needed
        {"$addFields": {
            "positive_num": {"$toInt": "$positive"},
            "negative_num": {"$toInt": "$negative"},
            "total_num": {"$toInt": "$total"}
        }},
        
        # Calculate review ratios
        {"$addFields": {
            "positive_ratio": {"$divide": ["$positive_num", "$total_num"]},
            "negative_ratio": {"$divide": ["$negative_num", "$total_num"]}
        }},
        
        # Sort by requested ratio
        {"$sort": {
            f"{sort_type}_ratio": -1 if sort_type == "positive" else 1
        }},
        
        # Limit results
        {"$limit": limit},
        
        # Project needed fields
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
    
    results = list(collection.aggregate(pipeline))
    
    # Format ratios as percentages for frontend display
    for game in results:
        game["positive_ratio"] = round(game["positive_ratio"] * 100, 2)
        game["negative_ratio"] = round(game["negative_ratio"] * 100, 2)
    
    return results

def get_games_by_reviews(limit=10, sort_type="positive"):
    """
    Retrieve games based on review data using simple review counts and ratios.
    
    Args:
        limit (int): Number of games to return
        sort_type (str): Sort by "positive" or "negative" ratio
    
    Returns:
        List of games with their review statistics
    """
    client = MongoClient("mongodb://localhost:27017/")
    db = client["videogames"]
    collection = db["reviews"]
    
    # Create pipeline for MongoDB aggregation
    pipeline = [
        # Filter out entries with no reviews or insufficient review volume
        {"$match": {
            "positive": {"$type": "number"},
            "negative": {"$type": "number"},
            "total": {"$gt": 10000}  # Minimum reviews threshold
        }},
        
        # Calculate review ratios
        {"$addFields": {
            "positive_ratio": {"$divide": ["$positive", {"$add": ["$positive", "$negative"]}]},
        }},
        
        # Sort by requested type
        {"$sort": {
            "positive_ratio": -1 if sort_type == "positive" else 1
        }},
        
        # Limit results
        {"$limit": limit},
        
        # Project needed fields
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
    
    results = list(collection.aggregate(pipeline))
    
    # Format ratios as percentages for frontend display
    for game in results:
        game["positive_ratio"] = round(game["positive_ratio"] * 100, 2)
        game["negative_ratio"] = 100 - game["positive_ratio"]
    
    return results

