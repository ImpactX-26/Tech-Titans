import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const createComplaint = async (data) => {
  const response = await api.post("/complaints/", data);
  return response.data;
};

export const getComplaint = async (complaintId) => {
  const response = await api.get(`/complaints/${complaintId}`);
  return response.data;
};

export const getComplaints = async () => {
  const response = await api.get("/complaints/");
  return response.data;
};

export const confirmComplaint = async (
  complaintId,
  confirmed,
  feedback = ""
) => {
  const response = await api.post(
    `/authority/complaints/${complaintId}/confirm`,
    {
      confirmed,
      feedback,
    }
  );

  return response.data;
};

export default api;