from datetime import datetime

from database.mongodb import complaints_collection
from graph.workflow import workflow


def generate_complaint_id():

    count = complaints_collection.count_documents({})

    return f"CF{1001 + count}"


def process_complaint(
    description,
    latitude,
    longitude,
    citizen_id
):

    complaint_id = generate_complaint_id()

    initial_state = {

        "complaint_id": complaint_id,

        "description": description,

        "latitude": latitude,

        "longitude": longitude,

        "citizen_id": citizen_id
    }

    result = workflow.invoke(initial_state)

    now = datetime.utcnow()

    document = {

        "complaint_id": complaint_id,

        "citizen_id": citizen_id,

        "description": description,

        "location": {

            "latitude": latitude,

            "longitude": longitude
        },

        "category":
            result["category"],

        "issue_type":
            result["issue_type"],

        "confidence":
            result["confidence"],

        "priority":
            result["priority"],

        "priority_score":
            result["priority_score"],

        "priority_reason":
            result["priority_reason"],

        "is_duplicate":
            result["is_duplicate"],

        "master_complaint_id":
            result["master_complaint_id"],

        "department":
            result["department"],

        "status":
            result["status"],

        "citizen_feedback":
            None,

        "created_at":
            now,

        "updated_at":
            now
    }

    complaints_collection.insert_one(document)

    document.pop("_id", None)

    return document