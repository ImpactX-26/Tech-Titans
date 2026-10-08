import json

from openai import OpenAI

from config import OPENAI_API_KEY, OPENAI_MODEL


client = OpenAI(api_key=OPENAI_API_KEY)


def local_classify(description: str):

    text = description.lower()

    keywords = {
        "Road": [
            "pothole",
            "road",
            "broken road",
            "street",
            "accident"
        ],

        "Garbage": [
            "garbage",
            "waste",
            "trash",
            "dump",
            "dirty"
        ],

        "Water": [
            "water",
            "pipeline",
            "water leakage",
            "water supply"
        ],

        "Drainage": [
            "drain",
            "drainage",
            "sewage",
            "flood",
            "blocked drain"
        ],

        "Streetlight": [
            "streetlight",
            "street light",
            "lamp",
            "dark road"
        ],

        "Electricity": [
            "electricity",
            "power",
            "power cut",
            "electric pole",
            "wire"
        ],

        "Traffic": [
            "traffic",
            "signal",
            "congestion",
            "vehicle"
        ]
    }

    for category, words in keywords.items():

        for word in words:

            if word in text:

                issue_type = word.title()

                return {
                    "category": category,
                    "issue_type": issue_type,
                    "confidence": 0.90
                }

    return {
        "category": "Other",
        "issue_type": "General Civic Issue",
        "confidence": 0.60
    }


def classify_complaint(description: str):

    prompt = f"""
You are an AI civic complaint classification agent.

Analyze this citizen complaint:

{description}

Choose exactly ONE category:

Road
Garbage
Water
Drainage
Streetlight
Electricity
Traffic
Other

Also identify the specific issue.

Return ONLY valid JSON in this format:

{{
    "category": "Road",
    "issue_type": "Pothole",
    "confidence": 0.95
}}

Confidence must be between 0 and 1.
"""

    try:

        response = client.responses.create(
            model=OPENAI_MODEL,
            input=prompt
        )

        result = json.loads(response.output_text)

        return {
            "category": result.get(
                "category",
                "Other"
            ),

            "issue_type": result.get(
                "issue_type",
                "General"
            ),

            "confidence": float(
                result.get(
                    "confidence",
                    0.5
                )
            )
        }

    except Exception:

        print("OpenAI unavailable. Using local AI fallback.")

        return local_classify(description)