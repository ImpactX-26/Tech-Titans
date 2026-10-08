DEPARTMENT_MAP = {

    "Road":
        "Road Maintenance Department",

    "Garbage":
        "Solid Waste Management Department",

    "Water":
        "Water Supply Department",

    "Drainage":
        "Drainage Department",

    "Streetlight":
        "Electrical Department",

    "Electricity":
        "Electrical Department",

    "Traffic":
        "Traffic Department",

    "Other":
        "Municipal General Department"
}


def route_complaint(category: str):

    return DEPARTMENT_MAP.get(
        category,
        "Municipal General Department"
    )