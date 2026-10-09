from pydantic import BaseModel


class ComplaintCreate(BaseModel):

    description: str

    latitude: float

    longitude: float

    citizen_id: str = "CITIZEN001"

    priority: str = "MEDIUM"


class StatusUpdate(BaseModel):

    status: str


class Confirmation(BaseModel):

    confirmed: bool

    feedback: str = ""