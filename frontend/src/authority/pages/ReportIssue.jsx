import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Camera, Send } from "lucide-react";
import { createComplaint } from "../services/api";
import LoadingAI from "../components/LoadingAI";

function ReportIssue() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError("");
      },
      () => {
        setError("Please allow location access to report the issue.");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (description.trim().length < 5) {
      setError("Please describe the issue clearly.");
      return;
    }

    if (!location) {
      setError("Please share your location before submitting.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const complaint = await createComplaint({
        description: description.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        citizen_id: "CITIZEN001",
      });

      navigate("/result", {
        state: { complaint },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Unable to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingAI />;
  }

  return (
    <div className="report-page">
      <div className="report-container">
        <h1>Report a Civic Issue</h1>

        <p className="page-description">
          Tell us what is wrong. Our AI will understand, prioritize and route
          your complaint to the right authority.
        </p>

        <form onSubmit={handleSubmit} className="report-form">
          <label>
            Describe the issue
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: There is a large pothole near the main road..."
            rows="6"
          />

          <label>
            Add a photo <span>(optional)</span>
          </label>

          <label className="photo-upload">
            <Camera size={22} />
            <span>
              {photo ? photo.name : "Choose an image"}
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              hidden
            />
          </label>

          <div className="location-section">
            <div>
              <strong>Location</strong>

              {location ? (
                <p className="location-success">
                  ✓ Location captured
                </p>
              ) : (
                <p>Location is required for routing your complaint.</p>
              )}
            </div>

            <button
              type="button"
              className="location-button"
              onClick={getLocation}
            >
              <MapPin size={18} />
              {location ? "Location Added" : "Share Location"}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button">
            <Send size={18} />
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIssue;