from database.mongodb import client, complaints_collection

try:
    client.admin.command("ping")
    print("MongoDB connected successfully!")

    complaint = {
        "name": "Test User",
        "email": "test@gmail.com",
        "category": "Technical",
        "description": "Test complaint from backend",
        "status": "Pending"
    }

    result = complaints_collection.insert_one(complaint)

    print("Complaint inserted successfully!")
    print("Complaint ID:", result.inserted_id)

except Exception as e:
    print("MongoDB operation failed!")
    print(e)