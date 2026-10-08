from pydantic import BaseModel


class ComplaintCreate(BaseModel):
    description: str
    latitude: float
    longitude: float
    citizen_id: str = "CITIZEN001"


class StatusUpdate(BaseModel):
    status: str


class Confirmation(BaseModel):
    confirmed: bool
    feedback: str = ""