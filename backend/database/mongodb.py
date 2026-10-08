from pymongo import MongoClient

from config import (
    MONGODB_URL,
    DATABASE_NAME
)


client = MongoClient(MONGODB_URL)

db = client[DATABASE_NAME]

complaints_collection = db["complaints"]


def test_database():

    try:
        client.admin.command("ping")
        return True

    except Exception:
        return False