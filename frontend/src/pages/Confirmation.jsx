import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

function Confirmation() {
  return (
    <div className="result-page">
      <div className="result-container">

        <div className="success-icon">
          <CheckCircle size={48} />
        </div>

        <h1>Complaint Confirmation</h1>

        <p className="result-subtitle">
          Your complaint has been successfully submitted.
          You can track its progress and confirm whether the issue
          has been resolved.
        </p>

        <div className="result-actions">
          <Link to="/track" className="primary-button">
            Track My Complaint
          </Link>

          <Link to="/" className="secondary-button">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Confirmation;