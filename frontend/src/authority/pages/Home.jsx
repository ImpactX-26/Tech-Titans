import { Link } from "react-router-dom";
import { AlertTriangle, MapPin, ShieldCheck } from "lucide-react";

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-icon">
            <ShieldCheck size={42} />
          </div>

          <h1>Make Your City Better.</h1>

          <p>
            Report civic problems in seconds. Our AI understands your
            complaint, prioritizes it, and sends it to the right authority.
          </p>

          <div className="hero-buttons">
            <Link to="/report" className="primary-button">
              <AlertTriangle size={20} />
              Report an Issue
            </Link>

            <Link to="/track" className="secondary-button">
              <MapPin size={20} />
              Track Complaint
            </Link>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How City Friction Works</h2>

        <div className="steps">
          <div className="step-card">
            <span>01</span>
            <h3>Report</h3>
            <p>Describe the civic issue and share its location.</p>
          </div>

          <div className="step-card">
            <span>02</span>
            <h3>AI Understands</h3>
            <p>
              AI classifies the issue, checks its priority and detects
              duplicate complaints.
            </p>
          </div>

          <div className="step-card">
            <span>03</span>
            <h3>Authority Acts</h3>
            <p>The complaint reaches the appropriate department.</p>
          </div>

          <div className="step-card">
            <span>04</span>
            <h3>Citizen Verifies</h3>
            <p>You confirm whether the issue has actually been resolved.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;