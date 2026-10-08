import os

from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

OPENAI_MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-6-luna"
)

MONGODB_URL = os.getenv(
    "MONGODB_URL",
    "mongodb://localhost:27017"
)

DATABASE_NAME = os.getenv(
    "DATABASE_NAME",
    "city_friction"
)