import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QML.css";

function QML() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");
  const hospital = localStorage.getItem("hospital");
  const patientDetails = useMemo(() => {
    try {
      const raw = localStorage.getItem("patientDetails");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!patientDetails || !patientDetails.patientName) {
      navigate("/patient-details", { replace: true });
    }
  }, [navigate, patientDetails]);

  const handleImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const predictQuantum = async () => {
    if (!image) {
      alert("Please upload MRI image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-qml", {
        method: "POST",
        body: formData,
      });
      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = { error: 'Invalid JSON response from server' };
      }
      if (!response.ok) {
        setResult({ error: data.detail || data.error || 'Server returned an error' });
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({ error: 'Failed to connect to server: ' + error.message });
    }
    setLoading(false);
  };

  const clearAll = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
  };

  const downloadReport = async () => {
    if (!result || result.error) {
      alert("Please generate a prediction first");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-report", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tumor_type: result.tumor_type,
          username: patientDetails?.patientName || username,
          age: patientDetails?.age || "",
          gender: patientDetails?.gender || "",
          patient_id: patientDetails?.patientId || "",
          contact_number: patientDetails?.contactNumber || "",
          address: patientDetails?.address || "",
          patient_db_id: patientDetails?.patient_db_id || null,
          hospital_username: username || ""
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary anchor element and click it
      const link = document.createElement('a');
      link.href = url;
      link.download = `Brain_Tumor_Report_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert('✓ Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("hospital");
    localStorage.removeItem("patientDetails");
    navigate("/", { replace: true });
  };

  // Tumor type descriptions
  const tumorDescriptions = {
    "glioma": "A type of brain tumor that arises from glial cells. It can vary in grade from benign to highly aggressive.",
    "meningioma": "A tumor that develops from the meninges (membranes surrounding the brain). Usually benign but can be serious.",
    "pituitary": "A tumor of the pituitary gland, located at the base of the brain. Often affects hormone production.",
    "no_tumor": "No tumor detected. The brain MRI appears normal."
  };

  const displayHospital = hospital || "Symbiosis";

  // Normalize descriptions lookup to cover both 'no_tumor' and 'notumor'
  const descKey = result && result.tumor_type ? result.tumor_type.toLowerCase() : "";

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
            <button className="nav-item active" onClick={() => navigate("/patient-details")}>
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
          <h1>Quantum ML Brain Tumor Analysis</h1>
          <p className="patient-subtitle">Upload MRI scans and classify brain tumors using Quantum Neural Networks</p>
        </section>

        {patientDetails && (
          <div className="analysis-patient-bar">
            <div className="patient-bar-item">
              <span className="bar-label">Patient:</span>
              <span className="bar-value">{patientDetails.patientName}</span>
            </div>
            <div className="patient-bar-item">
              <span className="bar-label">Age:</span>
              <span className="bar-value">{patientDetails.age} yrs</span>
            </div>
            <div className="patient-bar-item">
              <span className="bar-label">Gender:</span>
              <span className="bar-value">{patientDetails.gender}</span>
            </div>
            {patientDetails.patientId && (
              <div className="patient-bar-item">
                <span className="bar-label">Patient ID:</span>
                <span className="bar-value">{patientDetails.patientId}</span>
              </div>
            )}
          </div>
        )}

        <div className="qml-content">
          <div className="upload-section">
            <h2>Upload MRI Image</h2>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                id="file-input"
                className="file-input"
              />
              <label htmlFor="file-input" className="upload-label">
                <div className="upload-icon">📁</div>
                <p>Click to upload or drag and drop</p>
                <p className="upload-hint">PNG, JPG, JPEG up to 10MB</p>
              </label>
            </div>
          </div>

          <div className="analysis-section">
            {preview && (
              <div className="image-preview-box">
                <h3>Preview</h3>
                <img src={preview} alt="MRI Preview" className="preview-image" />
                <p className="image-name">{image?.name}</p>
              </div>
            )}

            <div className="analysis-right">
              <div className="controls">
                <button
                  className="predict-btn"
                  onClick={predictQuantum}
                  disabled={!image || loading}
                >
                  {loading ? "🔄 Analyzing..." : "🚀 Analyze"}
                </button>
                <button
                  className="clear-btn"
                  onClick={clearAll}
                  disabled={!image && !result}
                >
                  🗑️ Clear
                </button>
              </div>

              {loading && (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>Running Quantum Neural Network prediction...</p>
                </div>
              )}

              {result && result.error && (
                <div className="result-box error">
                  <h2>⚠️ Error</h2>
                  <p>{result.error}</p>
                </div>
              )}

              {result && !result.error && (
                <div className="result-box success">
                  <div className="result-header">
                    <h2>✅ Analysis Complete</h2>
                  </div>

                  <div className="result-grid">
                    <div className="result-item">
                      <label>Predicted Tumor Type:</label>
                      <div className="tumor-type">
                        <span className={`result-badge ${result.tumor_type.toLowerCase()}`}>
                          {result.tumor_type === "notumor" ? "No Tumor" : result.tumor_type.toUpperCase().replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="tumor-description">
                    <h3>About {result.tumor_type.replace('_', ' ').toUpperCase()}:</h3>
                    <p>
                      {tumorDescriptions[descKey] || 
                       tumorDescriptions[descKey.replace('no_tumor', 'notumor')] || 
                       tumorDescriptions[descKey.replace('notumor', 'no_tumor')] || 
                       "Classification complete."}
                    </p>
                  </div>

                  <div className="result-actions">
                    <button className="action-btn" onClick={downloadReport}>
                      📥 Download Report
                    </button>
                    <button className="action-btn secondary" onClick={clearAll}>
                      🔄 Analyze Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default QML;
