import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientsRegistry.css";

function PatientsRegistry() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const hospital = localStorage.getItem("hospital");

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPatientId, setExpandedPatientId] = useState(null);

  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true });
      return;
    }

    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/patients?hospital_username=${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch patients list");
        }
        const data = await response.json();
        // Sort patients by id descending (newest first)
        setPatients(data.sort((a, b) => b.id - a.id));
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [username, navigate]);

  const toggleExpand = (patientId) => {
    setExpandedPatientId((prev) => (prev === patientId ? null : patientId));
  };

  const handleNewAnalysis = (patient) => {
    const patientData = {
      patientName: patient.name,
      age: patient.age,
      gender: patient.gender,
      patientId: patient.patient_custom_id || "",
      contactNumber: patient.contact || "",
      address: patient.address || "",
      patient_db_id: patient.id,
    };
    localStorage.setItem("patientDetails", JSON.stringify(patientData));
    navigate("/qml");
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("hospital");
    localStorage.removeItem("patientDetails");
    navigate("/", { replace: true });
  };

  return (
    <div className="registry-container">
      <div className="registry-header">
        <div className="header-left">
          <h1>
            <span className="title-icon">📋</span> Patient & Report Registry
          </h1>
          <p className="subtitle">
            Manage records and browse classification history for {hospital || "your hospital"}
          </p>
        </div>
        <div className="header-right">
          <button
            className="registry-btn secondary"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>
          <button className="registry-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="registry-content">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading patient records...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h2>⚠️ Error Loading Records</h2>
            <p>{error}</p>
            <button
              className="registry-btn secondary"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && patients.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h2>No Patient Records Found</h2>
            <p>You haven't added any patients yet. Start by creating a patient entry.</p>
            <button
              className="registry-btn"
              onClick={() => navigate("/patient-details")}
            >
              Add First Patient →
            </button>
          </div>
        )}

        {!loading && !error && patients.length > 0 && (
          <div className="table-card">
            <table className="registry-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Reports Count</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => {
                  const isExpanded = expandedPatientId === patient.id;
                  return (
                    <React.Fragment key={patient.id}>
                      <tr
                        className={`patient-row ${isExpanded ? "expanded" : ""}`}
                        onClick={() => toggleExpand(patient.id)}
                      >
                        <td>
                          <strong>{patient.patient_custom_id || `DB-${patient.id}`}</strong>
                        </td>
                        <td>{patient.name}</td>
                        <td>{patient.age} yrs</td>
                        <td>
                          <span className={`gender-badge ${patient.gender.toLowerCase()}`}>
                            {patient.gender}
                          </span>
                        </td>
                        <td>
                          <span className="reports-count-badge">
                            {patient.reports ? patient.reports.length : 0} report(s)
                          </span>
                        </td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <button
                            className="action-btn-sm"
                            onClick={() => toggleExpand(patient.id)}
                          >
                            {isExpanded ? "Hide Details" : "View Details"}
                          </button>
                          <button
                            className="action-btn-sm primary"
                            onClick={() => handleNewAnalysis(patient)}
                          >
                            New Analysis
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="details-row">
                          <td colSpan="6">
                            <div className="details-expanded-card">
                              <div className="details-grid">
                                <div>
                                  <h4>Patient Information</h4>
                                  <p>
                                    <strong>Contact:</strong>{" "}
                                    {patient.contact || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Address:</strong>{" "}
                                    {patient.address || "N/A"}
                                  </p>
                                </div>
                                <div className="reports-column">
                                  <h4>Analysis History</h4>
                                  {patient.reports && patient.reports.length > 0 ? (
                                    <ul className="reports-list">
                                      {patient.reports.map((report) => (
                                        <li key={report.id} className="report-item">
                                          <div className="report-info">
                                            <span className="tumor-type-label">
                                              Result:{" "}
                                              <strong>
                                                {report.tumor_type.toUpperCase().replace("_", " ")}
                                              </strong>
                                            </span>
                                            <span className="report-date">
                                              {report.created_at}
                                            </span>
                                          </div>
                                          <a
                                            href={`http://127.0.0.1:8000${report.pdf_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="download-report-link"
                                          >
                                            📥 Download PDF
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <p className="no-reports-msg">
                                      No reports generated for this patient yet.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientsRegistry;
