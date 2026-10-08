from fastapi import APIRouter, HTTPException

from models.complaint import ComplaintCreate

from services.complaint_service import process_complaint

from database.mongodb import complaints_collection


router = APIRouter(
    prefix="/complaints",
    tags=["Citizen Complaints"]
)


@router.post("/")
def create_complaint(
    complaint: ComplaintCreate
):

    result = process_complaint(
        description=complaint.description,
        latitude=complaint.latitude,
        longitude=complaint.longitude,
        citizen_id=complaint.citizen_id
    )

    return result


@router.get("/")
def get_all_complaints():

    complaints = list(
        complaints_collection.find(
            {},
            {"_id": 0}
        )
    )

    return complaints


@router.get("/{complaint_id}")
def get_complaint(
    complaint_id: str
):

    complaint = complaints_collection.find_one(
        {
            "complaint_id": complaint_id
        },
        {
            "_id": 0
        }
    )

    if not complaint:

        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint