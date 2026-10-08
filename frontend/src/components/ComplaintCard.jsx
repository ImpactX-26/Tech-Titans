import PriorityBadge from "./PriorityBadge";

function ComplaintCard({ complaint }) {
  return (
    <div className="complaint-card">
      <div className="complaint-card-header">
        <h3>{complaint.complaint_id}</h3>
        <PriorityBadge priority={complaint.priority} />
      </div>

      <p>{complaint.description}</p>

      <div className="complaint-info">
        <span>
          <strong>Category:</strong> {complaint.category}
        </span>

        <span>
          <strong>Issue:</strong> {complaint.issue_type}
        </span>

        <span>
          <strong>Department:</strong> {complaint.department}
        </span>

        <span>
          <strong>Status:</strong> {complaint.status}
        </span>
      </div>
    </div>
  );
}

export default ComplaintCard;