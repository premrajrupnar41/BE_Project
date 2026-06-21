import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const hospital = localStorage.getItem("hospital");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("hospital");
    localStorage.removeItem("patientDetails");
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-left">
          <h1><span className="title-icon">🧠</span> Brain Tumor Classification System</h1>
          <p className="subtitle">Advanced AI-Powered Medical Imaging Analysis</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <p><strong>Username:</strong> {username || "Guest"}</p>
            {hospital && <p><strong>Hospital:</strong> {hospital}</p>}
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="models-grid">
          <div className="model-card" onClick={() => navigate("/patient-details")}>
            <div className="card-icon">⚛️</div>
            <h2>Quantum ML Model</h2>
            <p className="model-description">
              QML-based machine learning for brain tumor classification
            </p>
            <ul className="model-features">
              <li>✓ Add patient details before analysis</li>
              <li>✓ Reliable image classification</li>
              <li>✓ Quantum-enhanced prediction workflow</li>
            </ul>
            <button className="card-btn">Enter Details & Start Analysis →</button>
          </div>

          <div className="model-card" onClick={() => navigate("/patients")}>
            <div className="card-icon">📋</div>
            <h2>Patient Registry</h2>
            <p className="model-description">
              View and download past patient reports and classification history
            </p>
            <ul className="model-features">
              <li>✓ Access database patient records</li>
              <li>✓ Retrieve generated PDF reports</li>
              <li>✓ Track classification dates & metrics</li>
            </ul>
            <button className="card-btn">View Patient Registry →</button>
          </div>
        </div>

        <div className="info-section">
          <h3>How to Use:</h3>
          <ol>
            <li>Open the classification flow and enter patient details</li>
            <li>Upload a brain MRI image (JPEG, PNG, etc.)</li>
            <li>Click "Analyze" to classify the image</li>
            <li>View tumor type results</li>
            <li>Download report </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
