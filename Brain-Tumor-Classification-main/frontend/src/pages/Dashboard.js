import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const hospital = localStorage.getItem("hospital");
  const patientDetails = localStorage.getItem("patientDetails") ? JSON.parse(localStorage.getItem("patientDetails")) : null;

  const [stats, setStats] = useState({
    total_patients: 0,
    total_analyses: 0,
    reports_generated: 0,
    recent_analyses: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) {
      navigate("/", { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/dashboard/stats?hospital_username=${username}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("hospital");
    localStorage.removeItem("patientDetails");
    navigate("/", { replace: true });
  };

  const displayName = username ? username.charAt(0).toUpperCase() + username.slice(1) : "User";
  const displayHospital = hospital || "Symboisis";

  return (
    <div className="db-layout">
      {/* 1. Sidebar Container */}
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
            <button className="nav-item active" onClick={() => navigate("/dashboard")}>
              <span className="nav-icon">📊</span> Dashboard
            </button>
            <button className="nav-item" onClick={() => navigate("/patient-details")}>
              <span className="nav-icon">➕</span> New Analysis
            </button>
            <button className="nav-item" onClick={() => navigate("/history")}>
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

      {/* 2. Main Content Area */}
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

        {/* Main Banner Greetings */}
        <section className="db-banner">
          <h1>Welcome, {displayName} 👋</h1>
          <p>Advanced AI-Powered Brain Tumor Analysis</p>
        </section>

        {/* 3. Statistics Cards Row */}
        <section className="db-stats-row">
          <div className="stats-card">
            <div className="card-header">
              <span className="card-icon stethoscope">🩺</span>
            </div>
            <div className="card-body">
              <p className="stats-label">Total Analyses</p>
              <h3 className="stats-value">{loading ? "..." : stats.total_analyses}</h3>
            </div>
          </div>

          <div className="stats-card">
            <div className="card-header">
              <span className="card-icon patients">👥</span>
            </div>
            <div className="card-body">
              <p className="stats-label">Patients</p>
              <h3 className="stats-value">{loading ? "..." : stats.total_patients}</h3>
            </div>
          </div>

          <div className="stats-card">
            <div className="card-header">
              <span className="card-icon reports">📄</span>
            </div>
            <div className="card-body">
              <p className="stats-label">Reports Generated</p>
              <h3 className="stats-value">{loading ? "..." : stats.reports_generated}</h3>
            </div>
          </div>
        </section>

        {/* 4. Quick Actions Panel */}
        <section className="db-quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate("/patient-details")}>
              <div className="action-card-header">
                <span className="action-icon">📝</span>
                <span className="arrow-icon">➔</span>
              </div>
              <h4>New Analysis</h4>
              <p>Upload MRI scan and get AI classification</p>
            </div>

            <div className="action-card" onClick={() => navigate("/history")}>
              <div className="action-card-header">
                <span className="action-icon">🕒</span>
                <span className="arrow-icon">➔</span>
              </div>
              <h4>Analysis History</h4>
              <p>View previous analysis results</p>
            </div>

            <div className="action-card" onClick={() => navigate("/patients")}>
              <div className="action-card-header">
                <span className="action-icon">📄</span>
                <span className="arrow-icon">➔</span>
              </div>
              <h4>Reports</h4>
              <p>Generate and download reports</p>
            </div>
          </div>
        </section>

        {/* 5. Recent Analyses Section */}
        <section className="db-recent-analyses">
          <div className="section-header">
            <h3>Recent Analyses</h3>
            <button className="view-all-btn" onClick={() => navigate("/patients")}>View All</button>
          </div>

          <div className="table-wrapper">
            <table className="analyses-table">
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
                {loading ? (
                  <tr>
                    <td colSpan="5" className="table-message">Loading recent records...</td>
                  </tr>
                ) : stats.recent_analyses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="table-message">No recent analyses found. Start by running a new analysis.</td>
                  </tr>
                ) : (
                  stats.recent_analyses.map((item) => (
                    <tr key={item.id}>
                      <td>{item.patient_custom_id}</td>
                      <td>{item.patient_name}</td>
                      <td>
                        <span className={`result-badge ${item.result.toLowerCase()}`}>
                          {item.result === "notumor" ? "No Tumor" : item.result.toUpperCase()}
                        </span>
                      </td>
                      <td>{item.confidence}</td>
                      <td>{item.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
