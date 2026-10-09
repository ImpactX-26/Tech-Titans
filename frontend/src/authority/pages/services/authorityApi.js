const API_BASE_URL = "http://127.0.0.1:8000";


// Get all complaints
export async function getAllComplaints() {
  const response = await fetch(
    `${API_BASE_URL}/complaints/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
}


// Get high-priority alerts
export async function getAlerts() {
  const response = await fetch(
    `${API_BASE_URL}/authority/alerts`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch alerts");
  }

  return response.json();
}


// Update complaint status
export async function updateComplaintStatus(
  complaintId,
  status
) {
  const response = await fetch(
    `${API_BASE_URL}/authority/complaints/${complaintId}/status`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        status: status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update status");
  }

  return response.json();
}


// Confirm resolution
export async function confirmResolution(
  complaintId,
  confirmed,
  feedback = ""
) {
  const response = await fetch(
    `${API_BASE_URL}/authority/complaints/${complaintId}/confirm`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        confirmed: confirmed,
        feedback: feedback,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to confirm resolution");
  }

  return response.json();
}