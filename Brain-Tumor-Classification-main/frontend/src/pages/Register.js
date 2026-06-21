import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hospital_name: "",
    email: "",
    contact: "",
    name: "",
    address: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    for (let key in form) {
      if (!form[key]) {
        alert("Please fill all fields");
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      if (response.ok) {
        alert("✓ Registration successful! Your account has been created. Please login now.");
        setForm({
          hospital_name: "",
          email: "",
          contact: "",
          name: "",
          address: "",
          username: "",
          password: "",
        });
        navigate("/");
      } else {
        // Extract error message from validation error
        let errorMsg = "Registration failed";
        if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMsg = data.detail;
          } else if (Array.isArray(data.detail)) {
            // Pydantic validation error - extract the message
            errorMsg = data.detail[0]?.msg || "Invalid input";
          } else {
            errorMsg = JSON.stringify(data.detail);
          }
        }
        alert("✗ " + errorMsg);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("✗ Error: " + (error?.message || "Network error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <section className="auth-brand">
          <h1>Create Clinical Workspace Account</h1>
          <p>
            Register your clinical workspace to access advanced MRI analysis
            tools powered by deep learning and quantum machine learning. Manage
            patient data, perform accurate tumor classification, and generate
            detailed diagnostic reports in a secure environment.
          </p>
          <div className="auth-chip-row">
            <span className="auth-chip">Clinical Dashboard</span>
            <span className="auth-chip">Secure Access</span>
            <span className="auth-chip">Access Portal</span>
          </div>
        </section>

        <section className="auth-panel">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Complete all fields to register</p>

          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-grid-2">
              <input
                name="hospital_name"
                placeholder="Hospital Name"
                value={form.hospital_name}
                onChange={handleChange}
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-grid-2">
              <input
                name="contact"
                placeholder="Contact"
                value={form.contact}
                onChange={handleChange}
              />
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />

            <div className="auth-grid-2">
              <input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register Account"}
            </button>

            <p className="auth-note">
              Already registered?{" "}
              <span className="auth-link" onClick={() => navigate("/")}>
                Back to Login
              </span>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;
