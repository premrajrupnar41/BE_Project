import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDetails.css";

function PatientDetails() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

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

  return (
    <div className="patient-container">
      <div className="patient-header">
        <div>
          <h1>Patient Details</h1>
          <p className="patient-subtitle">Enter details before tumor classification</p>
          <p className="patient-user">Username: {username || "Guest"}</p>
        </div>
        <div className="patient-header-actions">
          <button className="patient-btn secondary" onClick={() => navigate("/dashboard")}>← Dashboard</button>
          <button className="patient-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <form className="patient-form-card" onSubmit={handleSubmit}>
        <div className="patient-form-grid">
          <label>
            Patient Name *
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="Enter patient full name"
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
            />
          </label>
        </div>

        <label>
          Contact Number
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact number"
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

        <div className="patient-submit-row">
          <button type="submit" className="patient-btn">
            Save Details & Continue to Classification →
          </button>
        </div>
      </form>
    </div>
  );
}

export default PatientDetails;
