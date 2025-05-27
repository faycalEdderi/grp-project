from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["videogames"]
collection = db["games"]

def get_top_10_games():
    return list(
        collection.find({}, {"_id": 0, "Name": 1, "Global_Sales": 1})
        .sort("Global_Sales", -1)
        .limit(10)
    )
