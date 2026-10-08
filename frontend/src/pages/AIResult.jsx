import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight, MapPin } from "lucide-react";
import PriorityBadge from "../components/PriorityBadge";

function AIResult() {
  const location = useLocation();
  const complaint = location.state?.complaint;

  if (!complaint) {
    return (
      <div className="result-page">
        <div className="result-container">
          <h1>No complaint data found</h1>
          <p>Please submit a complaint first.</p>

          <Link to="/report" className="primary-button">
            Report an Issue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="result-container">

        <div className="success-icon">
          <CheckCircle size={48} />
        </div>

        <h1>Complaint Submitted Successfully</h1>

        <p className="result-subtitle">
          Our AI has analyzed your complaint and routed it to the
          appropriate department.
        </p>

        <div className="complaint-id-box">
          <span>Complaint ID</span>
          <strong>{complaint.complaint_id}</strong>
        </div>

        <div className="ai-result-card">
          <div className="result-row">
            <span>Category</span>
            <strong>{complaint.category || "Civic Issue"}</strong>
          </div>

          <div className="result-row">
            <span>Issue Type</span>
            <strong>{complaint.issue_type || "General Issue"}</strong>
          </div>

          <div className="result-row">
            <span>Priority</span>
            <PriorityBadge
              priority={complaint.priority || "MEDIUM"}
            />
          </div>

          <div className="result-row">
            <span>Department</span>
            <strong>
              {complaint.department || "Municipal Authority"}
            </strong>
          </div>

          <div className="result-row">
            <span>Status</span>
            <strong>{complaint.status || "ASSIGNED"}</strong>
          </div>
        </div>

        <div className="location-info">
          <MapPin size={20} />
          <span>
            Your complaint location has been recorded for proper routing.
          </span>
        </div>

        <div className="result-actions">
          <Link to="/track" className="primary-button">
            Track Complaint
            <ArrowRight size={18} />
          </Link>

          <Link to="/" className="secondary-button">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default AIResult;