import pandas as pd
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["videogames_steam"]
collection = db["games_steam"]

df = pd.read_csv("steamspy_insights.csv", on_bad_lines='skip')

df.fillna("", inplace=True)

documents = df.to_dict(orient="records")

if documents:
    collection.insert_many(documents)
    print(f"{len(documents)} documents insérés dans la collection 'games_steam'.")
else:
    print("Aucune donnée à insérer.")
