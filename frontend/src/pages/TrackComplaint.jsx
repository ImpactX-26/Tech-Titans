import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, CheckCircle } from "lucide-react";
import { getComplaint } from "../services/api";
import PriorityBadge from "../components/PriorityBadge";
import StatusTimeline from "../components/StatusTimeline";

function TrackComplaint() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!complaintId.trim()) {
      setError("Please enter a complaint ID.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setComplaint(null);

      const data = await getComplaint(complaintId.trim());

      setComplaint(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Complaint not found. Please check the complaint ID."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-page">
      <div className="report-container">

        <h1>Track Your Complaint</h1>

        <p className="page-description">
          Enter your complaint ID to see the latest status
          and progress of your issue.
        </p>

        <form
          className="report-form"
          onSubmit={handleSearch}
        >
          <label>Complaint ID</label>

          <input
            type="text"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            placeholder="Example: CMP-12345"
            style={{
              width: "100%",
              padding: "15px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              outline: "none",
            }}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            <Search size={18} />

            {loading ? "Searching..." : "Track Complaint"}
          </button>
        </form>

        {complaint && (
          <div style={{ marginTop: "30px" }}>

            <div className="ai-result-card">

              <div className="result-row">
                <span>Complaint ID</span>
                <strong>
                  {complaint.complaint_id}
                </strong>
              </div>

              <div className="result-row">
                <span>Category</span>
                <strong>
                  {complaint.category || "Civic Issue"}
                </strong>
              </div>

              <div className="result-row">
                <span>Department</span>
                <strong>
                  {complaint.department || "Municipal Authority"}
                </strong>
              </div>

              <div className="result-row">
                <span>Priority</span>

                <PriorityBadge
                  priority={
                    complaint.priority || "MEDIUM"
                  }
                />
              </div>

              <div className="result-row">
                <span>Status</span>
                <strong>
                  {complaint.status || "ASSIGNED"}
                </strong>
              </div>

            </div>

            <div style={{ marginTop: "25px" }}>
              <h3>Status Progress</h3>

              <StatusTimeline
                status={
                  complaint.status || "ASSIGNED"
                }
              />
            </div>

            {complaint.status === "RESOLVED" && (
              <div className="location-info">
                <CheckCircle size={20} />

                <span>
                  Your complaint has been marked as resolved.
                  Please confirm whether the issue has actually
                  been fixed.
                </span>
              </div>
            )}

            {complaint.status === "RESOLVED" && (
              <Link
                to={`/confirm/${complaint.complaint_id}`}
                className="primary-button"
                style={{
                  marginTop: "15px",
                }}
              >
                Confirm Resolution
              </Link>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default TrackComplaint;