import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login Response:", response.status, data);

      if (response.ok) {
        localStorage.setItem("username", username);
        localStorage.setItem("hospital", data.hospital || "");
        alert("✓ Login successful! Welcome to Brain Tumor Classification.");
        // Delay navigation slightly to ensure localStorage is set before page loads
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 500);
      } else {
        let errorMsg = "Login failed";
        if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMsg = data.detail;
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
          <h1>Brain Tumor Classification Portal</h1>
          <p>
            An intelligent MRI analysis platform that uses deep learning and
            quantum-enhanced models to detect and classify brain tumors
            accurately, enabling faster and more reliable clinical decision
            support.
          </p>
          <div className="auth-chip-row">
            <span className="auth-chip">Quantum ML</span>
      
            <span className="auth-chip">PDF Report</span>
          </div>
        </section>

        <section className="auth-panel">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Use your project credentials to continue</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login to Dashboard"}
            </button>

            <p className="auth-note">
              Need an account?{" "}
              <span className="auth-link" onClick={() => navigate("/register")}>
                Create one
              </span>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
