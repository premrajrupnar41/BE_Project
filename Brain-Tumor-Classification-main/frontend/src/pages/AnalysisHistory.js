import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientsRegistry.css";
import "./Dashboard.css"; // Ensure topbar and badge styles are loaded

function AnalysisHistory() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const hospital = localStorage.getItem("hospital");

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true });
      return;
    }

    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/analyses?hospital_username=${username}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch analyses list");
        }
        const data = await response.json();
        setAnalyses(data);
      } catch (err) {
        console.error("Error fetching analyses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("hospital");
    localStorage.removeItem("patientDetails");
    navigate("/", { replace: true });
  };

  const displayHospital = hospital || "Symbiosis";

  return (
    <div className="db-layout">
      {/* Sidebar Container */}
      <aside className="db-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">🧠</div>
          <div className="brand-text">
            <h2>Brain Tumor</h2>
            <p>Classification System</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group">
            <button className="nav-item" onClick={() => navigate("/dashboard")}>
              <span className="nav-icon">📊</span> Dashboard
            </button>
            <button className="nav-item" onClick={() => navigate("/patient-details")}>
              <span className="nav-icon">➕</span> New Analysis
            </button>
            <button className="nav-item active" onClick={() => navigate("/history")}>
              <span className="nav-icon">🕒</span> Analysis History
            </button>
            <button className="nav-item" onClick={() => navigate("/patients")}>
              <span className="nav-icon">👥</span> Patient Registry
            </button>
            <button className="nav-item" onClick={() => navigate("/help")}>
              <span className="nav-icon">❓</span> Help & Support
            </button>
          </div>
        </nav>

        {/* AI Model Status Widget with Hologram Brain */}
        <div className="sidebar-model-status">
          <div className="hologram-container">
            <div className="hologram-glow-ring"></div>
            <div className="hologram-platform"></div>
            <div className="hologram-brain">🧠</div>
          </div>
          <p>Model: Quantum ML v2.1</p>
          <span className="status-indicator">● Online</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="db-main">
        {/* Top Profile Header Bar */}
        <header className="db-topbar">
          <div className="topbar-left-brand">
            <span className="topbar-brand-logo">🧠</span>
            <div className="topbar-brand-title">
              <h1>Quantum ML Brain Tumor Analysis</h1>
              <div className="topbar-user-info">
                <span>🏥 {displayHospital}</span>
              </div>
            </div>
          </div>
          
          <div className="topbar-actions">
            <button className="topbar-btn logout" onClick={handleLogout}>
              <span className="topbar-btn-icon">🚪</span> Logout
            </button>
          </div>
        </header>

        {/* Header Title */}
        <section className="db-banner">
          <h1>Analysis History</h1>
          <p className="patient-subtitle">
            Browse and download reports for all completed brain tumor classifications
          </p>
        </section>

        <div className="registry-content">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading analysis history...</p>
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

          {!loading && !error && analyses.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🕒</div>
              <h2>No Analyses Found</h2>
              <p>You haven't run any analyses yet. Start by creating a patient entry.</p>
              <button
                className="registry-btn"
                onClick={() => navigate("/patient-details")}
              >
                Start First Analysis →
              </button>
            </div>
          )}

          {!loading && !error && analyses.length > 0 && (
            <div className="table-card">
              <table className="registry-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Result</th>
                    <th>Confidence</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {analyses.map((item) => (
                    <tr key={item.id} className="patient-row">
                      <td>
                        <strong>{item.patient_custom_id}</strong>
                      </td>
                      <td>{item.patient_name}</td>
                      <td>
                        <span className={`result-badge ${item.result.toLowerCase()}`}>
                          {item.result === "notumor" ? "No Tumor" : item.result.toUpperCase().replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        <strong>{item.confidence}</strong>
                      </td>
                      <td>{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AnalysisHistory;
