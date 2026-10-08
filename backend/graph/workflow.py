from typing import TypedDict, Optional

from langgraph.graph import StateGraph, START, END

from agents.classifier import classify_complaint
from agents.priority import calculate_priority
from agents.duplicate import check_duplicate
from agents.routing import route_complaint


class ComplaintState(TypedDict, total=False):

    complaint_id: str
    description: str
    latitude: float
    longitude: float
    citizen_id: str

    category: str
    issue_type: str
    confidence: float

    priority: str
    priority_score: int
    priority_reason: str

    is_duplicate: bool
    master_complaint_id: Optional[str]

    department: str
    status: str


def classification_node(state):

    result = classify_complaint(
        state["description"]
    )

    return {
        "category": result["category"],
        "issue_type": result["issue_type"],
        "confidence": result["confidence"]
    }


def priority_node(state):

    result = calculate_priority(
        state["description"],
        state["category"],
        state["issue_type"]
    )

    return {
        "priority": result["priority"],
        "priority_score": result["score"],
        "priority_reason": result["reason"]
    }


def duplicate_node(state):

    result = check_duplicate(
        state["category"],
        state["latitude"],
        state["longitude"]
    )

    return {
        "is_duplicate": result["is_duplicate"],
        "master_complaint_id": result["master_complaint_id"]
    }


def routing_node(state):

    department = route_complaint(
        state["category"]
    )

    return {
        "department": department,
        "status": "ASSIGNED"
    }


builder = StateGraph(ComplaintState)

builder.add_node(
    "classification",
    classification_node
)

builder.add_node(
    "priority",
    priority_node
)

builder.add_node(
    "duplicate",
    duplicate_node
)

builder.add_node(
    "routing",
    routing_node
)


builder.add_edge(
    START,
    "classification"
)

builder.add_edge(
    "classification",
    "priority"
)

builder.add_edge(
    "priority",
    "duplicate"
)

builder.add_edge(
    "duplicate",
    "routing"
)

builder.add_edge(
    "routing",
    END
)


workflow = builder.compile()