from database.mongodb import complaints_collection


def check_duplicate(
    category: str,
    latitude: float,
    longitude: float
):

    existing = complaints_collection.find_one({

        "category": category,

        "status": {
            "$ne": "CLOSED"
        },

        "location.latitude": {
            "$gte": latitude - 0.005,
            "$lte": latitude + 0.005
        },

        "location.longitude": {
            "$gte": longitude - 0.005,
            "$lte": longitude + 0.005
        }
    })

    if existing:

        return {
            "is_duplicate": True,
            "master_complaint_id": existing.get(
                "complaint_id"
            )
        }

    return {
        "is_duplicate": False,
        "master_complaint_id": None
    }