import os
from pymongo import MongoClient
from dotenv import load_dotenv
from pymongo.errors import PyMongoError

load_dotenv()

uri = os.getenv("MONGO_URI")
db_name = os.getenv("MONGO_DATABASE")
collection_name = os.getenv("MONGO_COLLECTION")

client = MongoClient(uri)

db = client[db_name]
collection = db[collection_name]

collection.insert_one({"test": True})

def save_scraped(data):
    if not isinstance(data, dict):
        raise TypeError(
            f"save_scraped recebeu tipo inválido: {type(data)}\nConteúdo: {data}"
        )

    try:
        result = collection.insert_one(data)
        return "added to database" 
    except Exception as e:
        print(f"Erro ao inserir no MongoDB: {e}")
        return "error in storage"



