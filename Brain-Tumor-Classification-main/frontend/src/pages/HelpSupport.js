import React from "react";
import { useNavigate } from "react-router-dom";
import "./HelpSupport.css";
import "./Dashboard.css"; // Reuse sidebar layout styles

function HelpSupport() {
  const navigate = useNavigate();
  const hospital = localStorage.getItem("hospital");

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
            <button className="nav-item" onClick={() => navigate("/history")}>
              <span className="nav-icon">🕒</span> Analysis History
            </button>
            <button className="nav-item" onClick={() => navigate("/patients")}>
              <span className="nav-icon">👥</span> Patient Registry
            </button>
            <button className="nav-item active" onClick={() => navigate("/help")}>
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
          <h1>Help & Support</h1>
          <p className="patient-subtitle">
            Learn how to use the Quantum Machine Learning System to classify brain tumors
          </p>
        </section>

        <div className="help-content">
          <div className="help-section-card">
            <h2>🧠 How to Classify a Brain Tumor (Step-by-Step Guide)</h2>
            <div className="help-steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-details">
                  <h3>Register Patient Demographics</h3>
                  <p>
                    Navigate to the <strong>New Analysis</strong> tab in the left sidebar menu. 
                    Fill in the patient's demographics details, including Name, Age, Gender, and 
                    other optional details like Patient ID, Contact, and Address. Click the 
                    <strong>"Save Details & Continue"</strong> button.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-details">
                  <h3>Upload Brain MRI Scan</h3>
                  <p>
                    Once the patient is successfully registered, the system redirects you to the 
                    <strong>Upload MRI</strong> interface. Click inside the upload box or drag and drop 
                    the brain MRI file (PNG, JPG, or JPEG formats up to 10MB are supported).
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-details">
                  <h3>Run Quantum ML Classification</h3>
                  <p>
                    Verify that the image preview appears correctly. Click the <strong>🚀 Analyze</strong> 
                    button to start the classification process. The model processes features using 
                    ResNet50 + Principal Component Analysis (PCA) and runs classification through a 
                    variational quantum circuit simulator.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-details">
                  <h3>Review Classification Results</h3>
                  <p>
                    Once prediction is complete, the results box displays the classified brain tumor 
                    type (<strong>Glioma</strong>, <strong>Meningioma</strong>, <strong>Pituitary</strong>, 
                    or <strong>No Tumor</strong>) and the prediction confidence percentage. 
                    You can read the condition description printed below the results.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-number">5</div>
                <div className="step-details">
                  <h3>Download Recommendation Report</h3>
                  <p>
                    Click the <strong>📥 Download Report</strong> button to generate a structured 
                    PDF clinical document. This report features custom wellness recommendations 
                    including anti-inflammatory diets and tailored physical exercises for the patient.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="help-section-card">
            <h2>❓ Frequently Asked Questions</h2>
            <div className="help-steps-grid">
              <div className="step-card">
                <div className="step-details">
                  <h3>Q: What is the accuracy of the Quantum ML classification?</h3>
                  <p>
                    The hybrid classical-quantum classification pipeline utilizes transfer learning features 
                    and achieves a validation accuracy range of 95%–97%, and test accuracy up to 99%.
                  </p>
                </div>
              </div>

              <div className="step-card">
                <div className="step-details">
                  <h3>Q: Where can I see all previous records?</h3>
                  <p>
                    Navigate to <strong>Analysis History</strong> to see a flat table list of all 
                    analyses run. You can also view grouped records and expansion histories by going 
                    to the <strong>Patient Registry</strong> menu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HelpSupport;
