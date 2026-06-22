import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDetails.css";

function PatientDetails() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const hospital = localStorage.getItem("hospital");

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    patientId: "",
    contactNumber: "",
    address: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.patientName || !formData.age || !formData.gender) {
      alert("Please fill Patient Name, Age, and Gender.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.patientName,
          age: parseInt(formData.age),
          gender: formData.gender,
          contact: formData.contactNumber || "",
          address: formData.address || "",
          patient_custom_id: formData.patientId || "",
          hospital_username: username || "Guest"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Failed to register patient in database");
      }

      const patientDetailsObj = {
        ...formData,
        patient_db_id: data.id
      };

      localStorage.setItem("patientDetails", JSON.stringify(patientDetailsObj));
      navigate("/qml");
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("✗ Failed to save patient details to database: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("hospital");
    localStorage.removeItem("patientDetails");
    navigate("/", { replace: true });
  };

  const displayHospital = hospital || "Symboisis";

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
          <h1>Patient Registry details</h1>
          <p className="patient-subtitle">Enter demographics before tumor classification</p>
        </section>

        {/* Form panel card */}
        <div className="patient-form-card">
          <form onSubmit={handleSubmit}>
            <div className="patient-form-grid">
              <label>
                Patient Name *
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter patient full name"
                  autoComplete="off"
                />
              </label>

              <label>
                Age *
                <input
                  type="number"
                  min="1"
                  max="120"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  autoComplete="off"
                />
              </label>

              <label>
                Gender *
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Patient ID
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  placeholder="Hospital or OPD ID"
                  autoComplete="off"
                />
              </label>

              <label className="patient-textarea-wrap">
                Contact Number
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  autoComplete="off"
                />
              </label>

              <label className="patient-textarea-wrap">
                Address
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter patient address"
                  rows={4}
                />
              </label>
            </div>

            <div className="patient-submit-row">
              <button type="submit" className="patient-btn">
                Save Details & Continue to Classification →
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PatientDetails;
