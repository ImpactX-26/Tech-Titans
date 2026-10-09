import { useEffect, useState } from "react";

import {
  getAllComplaints,
  getAlerts,
  updateComplaintStatus,
} from "./services/authorityApi";

import "../authority.css";


function AuthorityDashboard() {

  const [complaints, setComplaints] = useState([]);

  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] = useState(null);


  // ========================================
  // LOAD DATA
  // ========================================

  async function loadDashboard() {

    try {

      setLoading(true);

      const complaintsData =
        await getAllComplaints();

      const alertsData =
        await getAlerts();

      setComplaints(complaintsData);

      setAlerts(alertsData);

    } catch (error) {

      console.error(error);

      alert(
        "Unable to load authority dashboard."
      );

    } finally {

      setLoading(false);

    }
  }


  useEffect(() => {

    loadDashboard();

  }, []);


  // ========================================
  // UPDATE STATUS
  // ========================================

  async function handleStatusChange(
    complaintId,
    newStatus
  ) {

    try {

      await updateComplaintStatus(
        complaintId,
        newStatus
      );

      await loadDashboard();

      if (selectedComplaint) {

        setSelectedComplaint({
          ...selectedComplaint,
          status: newStatus,
        });

      }

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update complaint status."
      );

    }
  }


  // ========================================
  // STATISTICS
  // ========================================

  const total = complaints.length;

  const assigned =
    complaints.filter(
      (c) => c.status === "ASSIGNED"
    ).length;

  const inProgress =
    complaints.filter(
      (c) => c.status === "IN_PROGRESS"
    ).length;

  const resolved =
    complaints.filter(
      (c) =>
        c.status === "RESOLVED" ||
        c.status === "CLOSED"
    ).length;


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="authority-loading">

        <div className="loading-spinner">
          ⟳
        </div>

        <h2>
          Loading Authority Dashboard...
        </h2>

      </div>

    );

  }


  // ========================================
  // DASHBOARD
  // ========================================

  return (

    <div className="authority-page">


      {/* HEADER */}

      <header className="authority-header">

        <div>

          <div className="authority-logo">
            🏢 CITY FRICTION
          </div>

          <p>
            Municipal Authority Dashboard
          </p>

        </div>


        <button
          className="refresh-btn"
          onClick={loadDashboard}
        >

          🔄 Refresh

        </button>

      </header>


      <main className="authority-container">


        {/* WELCOME */}

        <section className="authority-welcome">

          <h1>
            Authority Dashboard
          </h1>

          <p>
            Monitor, manage and resolve
            citizen complaints.
          </p>

        </section>


        {/* STATISTICS */}

        <section className="stats-grid">


          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>

              <span>
                Total Complaints
              </span>

              <strong>
                {total}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🟠
            </div>

            <div>

              <span>
                Assigned
              </span>

              <strong>
                {assigned}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🔵
            </div>

            <div>

              <span>
                In Progress
              </span>

              <strong>
                {inProgress}
              </strong>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>

              <span>
                Resolved
              </span>

              <strong>
                {resolved}
              </strong>

            </div>

          </div>

        </section>


        {/* ALERTS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                🚨 Priority Alerts
              </h2>

              <p>
                High-priority complaints requiring
                attention.
              </p>

            </div>

            <span className="alert-count">
              {alerts.length}
            </span>

          </div>


          {alerts.length === 0 ? (

            <div className="empty-state">

              ✅ No high-priority alerts.

            </div>

          ) : (

            <div className="alert-list">

              {alerts.map((complaint) => (

                <div
                  className="alert-card"
                  key={complaint.complaint_id}
                  onClick={() =>
                    setSelectedComplaint(
                      complaint
                    )
                  }
                >

                  <div>

                    <strong>
                      {complaint.complaint_id}
                    </strong>

                    <p>
                      {complaint.description}
                    </p>

                  </div>


                  <span
                    className={
                      complaint.priority === "HIGH"
                        ? "priority-high"
                        : "priority-critical"
                    }
                  >

                    {complaint.priority}

                  </span>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ALL COMPLAINTS */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>

              <h2>
                📋 All Complaints
              </h2>

              <p>
                Manage citizen complaints.
              </p>

            </div>

          </div>


          {complaints.length === 0 ? (

            <div className="empty-state">

              No complaints available.

            </div>

          ) : (

            <div className="complaint-table-wrapper">

              <table className="complaint-table">

                <thead>

                  <tr>

                    <th>ID</th>

                    <th>Issue</th>

                    <th>Category</th>

                    <th>Priority</th>

                    <th>Department</th>

                    <th>Status</th>

                    <th>Action</th>

                  </tr>

                </thead>


                <tbody>

                  {complaints.map(
                    (complaint) => (

                    <tr
                      key={
                        complaint.complaint_id
                      }
                    >

                      <td>

                        <strong>
                          {
                            complaint.complaint_id
                          }
                        </strong>

                      </td>


                      <td>
                        {complaint.issue_type}
                      </td>


                      <td>
                        {complaint.category}
                      </td>


                      <td>

                        <span
                          className={`priority-badge priority-${String(
                            complaint.priority
                          ).toLowerCase()}`}
                        >

                          {
                            complaint.priority
                          }

                        </span>

                      </td>


                      <td>
                        {
                          complaint.department
                        }
                      </td>


                      <td>

                        <span
                          className={`status-badge status-${String(
                            complaint.status
                          ).toLowerCase()}`}
                        >

                          {
                            complaint.status
                          }

                        </span>

                      </td>


                      <td>

                        <button
                          className="view-btn"
                          onClick={() =>
                            setSelectedComplaint(
                              complaint
                            )
                          }
                        >

                          View

                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>


        {/* COMPLAINT DETAILS MODAL */}

        {selectedComplaint && (

          <div className="modal-overlay">

            <div className="complaint-modal">


              <button
                className="close-modal"
                onClick={() =>
                  setSelectedComplaint(null)
                }
              >

                ✕

              </button>


              <h2>
                Complaint Details
              </h2>


              <div className="complaint-id-large">

                {
                  selectedComplaint.complaint_id
                }

              </div>


              <div className="detail-grid">


                <div>

                  <span>
                    Issue
                  </span>

                  <strong>
                    {
                      selectedComplaint.issue_type
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Category
                  </span>

                  <strong>
                    {
                      selectedComplaint.category
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Priority
                  </span>

                  <strong>
                    {
                      selectedComplaint.priority
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Department
                  </span>

                  <strong>
                    {
                      selectedComplaint.department
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Duplicate
                  </span>

                  <strong>
                    {
                      selectedComplaint.is_duplicate
                        ? "Yes"
                        : "No"
                    }
                  </strong>

                </div>


                <div>

                  <span>
                    Status
                  </span>

                  <strong>
                    {
                      selectedComplaint.status
                    }
                  </strong>

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="description-box">

                <h3>
                  Citizen Description
                </h3>

                <p>
                  {
                    selectedComplaint.description
                  }
                </p>

              </div>


              {/* STATUS CONTROL */}

              <div className="status-control">

                <label>
                  Update Status
                </label>


                <select
                  value={
                    selectedComplaint.status
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedComplaint.complaint_id,
                      e.target.value
                    )
                  }
                >

                  <option value="ASSIGNED">
                    Assigned
                  </option>

                  <option value="IN_PROGRESS">
                    In Progress
                  </option>

                  <option value="RESOLVED">
                    Resolved
                  </option>

                  <option value="CLOSED">
                    Closed
                  </option>

                  <option value="REOPENED">
                    Reopened
                  </option>

                </select>

              </div>


              {/* LOCATION */}

              {selectedComplaint.location && (

                <div className="location-box">

                  📍 Location available

                </div>

              )}

            </div>

          </div>

        )}

      </main>

    </div>

  );

}


export default AuthorityDashboard;