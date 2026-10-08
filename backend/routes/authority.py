from fastapi import APIRouter, HTTPException

from models.complaint import StatusUpdate, Confirmation

from database.mongodb import complaints_collection


router = APIRouter(
    prefix="/authority",
    tags=["Municipal Authority"]
)


ALLOWED_STATUSES = [
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
    "REOPENED"
]


@router.put(
    "/complaints/{complaint_id}/status"
)
def update_status(
    complaint_id: str,
    data: StatusUpdate
):

    if data.status not in ALLOWED_STATUSES:

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    result = complaints_collection.update_one(
        {
            "complaint_id": complaint_id
        },
        {
            "$set": {
                "status": data.status
            }
        }
    )

    if result.matched_count == 0:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return {
        "message": "Status updated",
        "complaint_id": complaint_id,
        "status": data.status
    }


@router.post(
    "/complaints/{complaint_id}/confirm"
)
def confirm_resolution(
    complaint_id: str,
    data: Confirmation
):

    complaint = complaints_collection.find_one(
        {
            "complaint_id": complaint_id
        }
    )

    if not complaint:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    if data.confirmed:
        new_status = "CLOSED"
    else:
        new_status = "REOPENED"

    complaints_collection.update_one(
        {
            "complaint_id": complaint_id
        },
        {
            "$set": {
                "status": new_status,
                "citizen_feedback": data.feedback
            }
        }
    )

    return {
        "message": "Confirmation processed",
        "complaint_id": complaint_id,
        "status": new_status
    }


@router.get("/alerts")
def get_alerts():

    alerts = list(
        complaints_collection.find(
            {
                "priority": {
                    "$in": [
                        "CRITICAL",
                        "HIGH"
                    ]
                },
                "status": {
                    "$ne": "CLOSED"
                }
            },
            {
                "_id": 0
            }
        )
    )

    return alerts