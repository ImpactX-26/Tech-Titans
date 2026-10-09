const API_BASE_URL = "http://127.0.0.1:8000";

export async function createComplaint(complaint) {
  const response = await fetch(`${API_BASE_URL}/complaints/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(complaint),
  });

  if (!response.ok) {
    throw new Error("Failed to create complaint");
  }

  return response.json();
}

export async function getComplaints() {
  const response = await fetch(`${API_BASE_URL}/complaints/`);

  if (!response.ok) {
    throw new Error("Failed to fetch complaints");
  }

  return response.json();
}

export async function getComplaint(complaintId) {
  const response = await fetch(
    `${API_BASE_URL}/complaints/${complaintId}`
  );

  if (!response.ok) {
    throw new Error("Complaint not found");
  }

  return response.json();
}
export async function trackComplaint(complaintId) {
  const response = await fetch(
    `${API_BASE_URL}/complaints/${complaintId}`
  );

  if (!response.ok) {
    throw new Error("Complaint not found");
  }

  return response.json();
}
