
import { useState, useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import {
  createComplaint,
  trackComplaint,
} from "./services/api";

import AuthorityDashboard from "./authority/pages/AuthorityDashboard";

// ========================================
// LOCATION PICKER
// ========================================

function LocationPicker({ setLatitude, setLongitude }) {
  useMapEvents({
    click(event) {
      setLatitude(event.latlng.lat);
      setLongitude(event.latlng.lng);
    },
  });

  return null;
}

// ========================================
// MAP VIEW UPDATER
// ========================================

function MapViewUpdater({ latitude, longitude }) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.setView([latitude, longitude], 16);
    }
  }, [latitude, longitude, map]);

  return null;
}

// ========================================
// LOCATION SEARCH
// ========================================

function LocationSearch({ setLatitude, setLongitude }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&q=${encodeURIComponent(search)}`,
          {
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error("Location search failed");
        }

        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Location search error:", error);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  function handleSelectLocation(location) {
    setLatitude(parseFloat(location.lat));
    setLongitude(parseFloat(location.lon));
    setSearch(location.display_name);
    setSuggestions([]);
  }

  return (
    <div className="location-search-container">
      <div className="location-search">
        <input
          type="text"
          placeholder="🔎 Search a street, area or landmark..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Search for a complaint location"
        />

        {searching && (
          <span className="search-loading">Searching...</span>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="location-suggestions">
          {suggestions.map((location) => (
            <button
              type="button"
              key={location.place_id}
              className="location-suggestion"
              onClick={() => handleSelectLocation(location)}
            >
              📍 {location.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ========================================
// CITIZEN APP
// ========================================

function CitizenApp() {
  const [description, setDescription] = useState("");
  const [citizenId] = useState("CITIZEN001");
  const [photo, setPhoto] = useState(null);
  const [priority, setPriority] = useState("MEDIUM");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationStatus, setLocationStatus] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [trackingId, setTrackingId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  // ========================================
  // GPS
  // ========================================

  function getCurrentLocation() {
    setLocationStatus("Getting your location...");

    if (!navigator.geolocation) {
      setLocationStatus("GPS is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLocationStatus("✓ Location detected successfully");
      },
      () => {
        setLocationStatus(
          "Unable to get your location. Please allow location access."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  // ========================================
  // TRACK COMPLAINT
  // ========================================

  async function handleTrackComplaint(event) {
    event.preventDefault();

    if (!trackingId.trim()) {
      alert("Please enter a Complaint ID.");
      return;
    }

    try {
      setTrackingLoading(true);
      setTrackedComplaint(null);

      const data = await trackComplaint(trackingId.trim());
      setTrackedComplaint(data);
    } catch (error) {
      console.error(error);
      alert("Complaint ID not found.");
    } finally {
      setTrackingLoading(false);
    }
  }

  // ========================================
  // SUBMIT COMPLAINT
  // ========================================

  async function handleSubmit(event) {
    event.preventDefault();

    if (latitude === null || longitude === null) {
      setLocationStatus("Please select a location first.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a complaint description.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const complaint = {
        description: description.trim(),
        latitude,
        longitude,
        citizen_id: citizenId,
        priority,
      };

      const data = await createComplaint(complaint);

      setResult(data);
      setDescription("");
      setPhoto(null);
      setPriority("MEDIUM");

      const photoInput = document.getElementById("problem-photo");
      if (photoInput) photoInput.value = "";
    } catch (error) {
      console.error(error);
      alert("Failed to submit complaint. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // CITIZEN PAGE
  // ========================================

  return (
    <main className="container">
      <header className="header">
        <div className="hero-badge">● LIVE CIVIC INTELLIGENCE</div>

        <h1>City Friction</h1>

        <p>
          Report problems. Track progress.
          <br />
          Help build a better city.
        </p>

        <div className="hero-tagline">
          <span>REPORT</span>
          <span>→</span>
          <span>AI ROUTE</span>
          <span>→</span>
          <span>RESOLVE</span>
        </div>
      </header>

      {/* COMPLAINT TRACKING */}

      <section className="card tracker-card">
        <div className="section-kicker">COMPLAINT TRACKING</div>

        <h2>Track your city issue</h2>

        <p>Enter your complaint ID to see where your issue stands.</p>

        <form onSubmit={handleTrackComplaint} className="tracker-form">
          <input
            type="text"
            placeholder="e.g. CF1006"
            value={trackingId}
            onChange={(event) => setTrackingId(event.target.value)}
            aria-label="Complaint ID"
            required
          />

          <button type="submit" disabled={trackingLoading}>
            {trackingLoading ? "Checking..." : "Track →"}
          </button>
        </form>

        {trackedComplaint && (
          <div className="tracker-result">
            <div className="tracking-header">
              <div>
                <span>COMPLAINT ID</span>
                <h3>{trackedComplaint.complaint_id}</h3>
              </div>

              <div className="tracking-status">
                {trackedComplaint.status}
              </div>
            </div>

            <div className="tracking-grid">
              <div>
                <span>Priority</span>
                <strong>{trackedComplaint.priority || "Not available"}</strong>
              </div>

              <div>
                <span>Department</span>
                <strong>{trackedComplaint.department || "Not assigned"}</strong>
              </div>

              <div>
                <span>Issue</span>
                <strong>{trackedComplaint.issue_type || "Not classified"}</strong>
              </div>

              <div>
                <span>Duplicate</span>
                <strong>{trackedComplaint.is_duplicate ? "Yes" : "No"}</strong>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SUBMIT COMPLAINT */}

      <section className="card complaint-card">
        <div className="section-kicker">REPORT A PROBLEM</div>

        <h2>What's happening in your city?</h2>

        <p className="section-description">
          Tell us what needs fixing. Our AI system will classify,
          prioritize and route your complaint to the right department.
        </p>

        <form onSubmit={handleSubmit}>
          {/* DESCRIPTION */}

          <div className="form-group">
            <label htmlFor="complaint-description">
              <span className="step-number">01</span>
              Describe the problem
            </label>

            <textarea
              id="complaint-description"
              rows="5"
              placeholder="Example: Large pothole near the main road causing traffic and unsafe driving..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />

            <div className="field-hint">
              Be specific. Location details, severity and impact help
              the AI classify the issue.
            </div>
          </div>

          {/* PRIORITY */}

          <div className="form-group">
            <label htmlFor="complaint-priority">
              <span className="step-number">02</span>
              How urgent is it?
            </label>

            <select
              id="complaint-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="LOW">🟢 Low — Minor inconvenience</option>
              <option value="MEDIUM">🟡 Medium — Needs attention</option>
              <option value="HIGH">🔴 High — Urgent problem</option>
            </select>

            <div className="field-hint">
              The backend's AI determines the saved complaint priority.
            </div>
          </div>

          {/* PHOTO */}

          <div className="form-group">
            <label htmlFor="problem-photo">
              <span className="step-number">03</span>
              Add visual evidence
            </label>

            <div className="photo-upload">
              <input
                type="file"
                accept="image/*"
                id="problem-photo"
                onChange={(event) =>
                  setPhoto(event.target.files?.[0] || null)
                }
              />

              <label htmlFor="problem-photo" className="photo-label">
                <span className="photo-icon">📷</span>

                <span>
                  {photo ? photo.name : "Choose a problem photo"}
                </span>

                <small>JPG, PNG or another image format</small>
              </label>
            </div>

            <div className="field-hint">
              Photo selection is available in this interface, but the
              current backend does not upload or save the photo.
            </div>
          </div>

          {/* LOCATION */}

          <div className="form-group">
            <label>
              <span className="step-number">04</span>
              Pin the problem location
            </label>

            <div className="location-actions">
              <button
                type="button"
                className="location-btn"
                onClick={getCurrentLocation}
              >
                📍 Use My Location
              </button>

              <span>or search below</span>
            </div>

            <p className="map-hint">
              Search for an area, street or landmark, or click directly
              on the map.
            </p>

            <div className="location-search-box">
              <LocationSearch
                setLatitude={setLatitude}
                setLongitude={setLongitude}
              />
            </div>

            <div className="map-wrapper">
              <div className="map-label">LIVE PROBLEM MAP</div>

              <MapContainer
                center={[12.9716, 77.5946]}
                zoom={13}
                style={{ height: "350px", width: "100%" }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapViewUpdater
                  latitude={latitude}
                  longitude={longitude}
                />

                <LocationPicker
                  setLatitude={setLatitude}
                  setLongitude={setLongitude}
                />

                {latitude !== null && longitude !== null && (
                  <Marker position={[latitude, longitude]} />
                )}
              </MapContainer>
            </div>

            {locationStatus && (
              <p className="location-success">{locationStatus}</p>
            )}

            {latitude !== null && longitude !== null && (
              <p className="location-success">
                ✓ Problem location selected
              </p>
            )}
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            className="submit-btn"
            disabled={
              loading || latitude === null || longitude === null
            }
          >
            {loading
              ? "⚙ Processing your complaint..."
              : "🚀 Submit Complaint"}
          </button>
        </form>

        {/* RESULT */}

        {result && (
          <div className="result" role="status" aria-live="polite">
            <div className="success-icon">✓</div>

            <div>
              <h2>Complaint successfully submitted!</h2>

              <p className="result-subtitle">
                Your complaint has been analyzed and routed by the
                civic intelligence system.
              </p>

              <div className="result-grid">
                <div>
                  <span>Complaint ID</span>
                  <strong>{result.complaint_id}</strong>
                </div>

                <div>
                  <span>Category</span>
                  <strong>{result.category || "Not available"}</strong>
                </div>

                <div>
                  <span>Issue</span>
                  <strong>{result.issue_type || "Not available"}</strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>{result.priority || "Not available"}</strong>
                </div>

                <div>
                  <span>Department</span>
                  <strong>{result.department || "Not assigned"}</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>{result.status || "Submitted"}</strong>
                </div>

                <div>
                  <span>Duplicate</span>
                  <strong>{result.is_duplicate ? "Yes" : "No"}</strong>
                </div>
              </div>

              <button
                type="button"
                className="location-btn"
                onClick={() => {
                  setTrackingId(result.complaint_id || "");
                  setTrackedComplaint(result);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                style={{ marginTop: "18px" }}
              >
                View this complaint
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

// ========================================
// MAIN APP
// ========================================

export default function App() {
  const [portal, setPortal] = useState("citizen");

  return (
    <>
      <nav className="portal-switcher">
        <div className="portal-brand">CITY FRICTION</div>

        <div className="portal-buttons">
          <button
            type="button"
            onClick={() => setPortal("citizen")}
            className={
              portal === "citizen"
                ? "portal-btn active citizen-active"
                : "portal-btn"
            }
          >
            👤 Citizen
          </button>

          <button
            type="button"
            onClick={() => setPortal("authority")}
            className={
              portal === "authority"
                ? "portal-btn active authority-active"
                : "portal-btn"
            }
          >
            🏢 Authority Dashboard
          </button>
        </div>
      </nav>

      {portal === "citizen" ? (
        <CitizenApp />
      ) : (
        <AuthorityDashboard />
      )}
    </>
  );
}