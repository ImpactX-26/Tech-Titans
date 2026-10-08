import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <ShieldCheck size={28} />
        <span>City Friction</span>
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/report">Report Issue</Link>
        <Link to="/track">Track Complaint</Link>
        <Link to="/authority">Authority</Link>
      </div>
    </nav>
  );
}

export default Navbar;