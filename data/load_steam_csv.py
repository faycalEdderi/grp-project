import os
import zipfile
import pandas as pd
from pymongo import MongoClient

BASE_DIR = os.path.expanduser("~/Documents/IPSSI/nosql/tp/grp-project/data")
ZIP_DIR = os.path.join(BASE_DIR, "steam-insights")
EXTRACT_DIR = os.path.join(ZIP_DIR, "extracted")
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "videogames_steam"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

os.makedirs(EXTRACT_DIR, exist_ok=True)

for filename in os.listdir(ZIP_DIR):
    if filename.endswith(".zip"):
        zip_path = os.path.join(ZIP_DIR, filename)
        print(f"\n Traitement de {filename}")

        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(EXTRACT_DIR)

            for extracted_file in zip_ref.namelist():
                if extracted_file.endswith(".csv"):
                    csv_path = os.path.join(EXTRACT_DIR, extracted_file)
                    collection_name = os.path.splitext(os.path.basename(extracted_file))[0]

                    print(f"Lecture du fichier CSV : {extracted_file}")

                    try:
                        df = pd.read_csv(csv_path, on_bad_lines='skip')
                        df.fillna("", inplace=True)

                        documents = df.to_dict(orient="records")
                        if documents:
                            db[collection_name].insert_many(documents)
                            print(f"{len(documents)} documents insérés dans la collection '{collection_name}'.")
                        else:
                            print(f"Fichier vide ou non valide : {extracted_file}")
                    except Exception as e:
                        print(f"Erreur lors du traitement de {extracted_file} : {e}")
