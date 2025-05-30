import pandas as pd
from pymongo import MongoClient

client = MongoClient("mongodb+srv://amalplancher:amalplancher@cluster0.nty7qvb.mongodb.net/covid?retryWrites=true&w=majority")

db = client["videogames"]
collection = db["games"]

df = pd.read_csv("dataset.csv")

df.fillna("", inplace=True)

documents = df.to_dict(orient="records")

if documents:
    collection.insert_many(documents)
    print(f"{len(documents)} documents insérés dans la collection 'games'.")
else:
    print("Aucune donnée à insérer.")
