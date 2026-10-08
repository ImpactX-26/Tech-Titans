import json

from openai import OpenAI

from config import OPENAI_API_KEY, OPENAI_MODEL


client = OpenAI(api_key=OPENAI_API_KEY)


def local_priority(description, category, issue_type):

    text = description.lower()

    critical_words = [
        "death",
        "dead",
        "fire",
        "electrocution",
        "collapse",
        "life threatening"
    ]

    high_words = [
        "dangerous",
        "accident",
        "falling",
        "injury",
        "flood",
        "sewage",
        "electric wire"
    ]

    for word in critical_words:

        if word in text:

            return {
                "priority": "CRITICAL",
                "score": 95,
                "reason": "The complaint may create a serious threat to public safety."
            }

    for word in high_words:

        if word in text:

            return {
                "priority": "HIGH",
                "score": 85,
                "reason": "The complaint creates a significant public safety risk."
            }

    return {
        "priority": "MEDIUM",
        "score": 60,
        "reason": "The complaint requires municipal attention."
    }


def calculate_priority(
    description: str,
    category: str,
    issue_type: str
):

    prompt = f"""
You are an AI municipal complaint priority agent.

Complaint:
{description}

Category:
{category}

Issue:
{issue_type}

Determine how urgent this complaint is.

Use ONLY:

CRITICAL
HIGH
MEDIUM
LOW

Consider:

- danger to people
- accidents
- health risks
- public safety
- severity

Return ONLY valid JSON:

{{
    "priority": "HIGH",
    "score": 85,
    "reason": "The issue creates a public safety risk."
}}

Score must be between 0 and 100.
"""

    try:

        response = client.responses.create(
            model=OPENAI_MODEL,
            input=prompt
        )

        result = json.loads(response.output_text)

        return {
            "priority": result.get("priority", "MEDIUM"),
            "score": int(result.get("score", 50)),
            "reason": result.get(
                "reason",
                "Requires municipal attention."
            )
        }

    except Exception:

        print("OpenAI unavailable. Using local priority fallback.")

        return local_priority(
            description,
            category,
            issue_type
        )