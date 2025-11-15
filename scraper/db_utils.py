import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGO_URI")
db_name = os.getenv("MONGO_DATABASE")
collection_name = os.getenv("MONGO_COLLECTION")

client = MongoClient(uri)

db = client[db_name]
collection = db[collection_name]

collection.insert_one({"test": True})

def save_scraped(data):
    try:
        result = collection.insert_one(data)
        return True 
    except PyMongoError as e:
        print(f"Erro ao inserir no MongoDB: {e}")
        return False


