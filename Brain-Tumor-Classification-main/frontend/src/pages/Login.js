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
          <div className="auth-logo">🧠</div>
          <h1>Brain Tumor Classification Portal</h1>
          <p>
            An intelligent MRI analysis platform that uses deep learning and
            quantum-enhanced models to detect and classify brain tumors
            accurately, enabling faster and more reliable clinical decision
            support.
          </p>
          <div className="auth-chip-row">
            <span className="auth-chip">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(45 12 12)" />
                <ellipse cx="12" cy="12" rx="3" ry="9" transform="rotate(-45 12 12)" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
              </svg>
              Quantum ML
            </span>
      
            <span className="auth-chip">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF Report
            </span>
          </div>
        </section>

        <section className="auth-panel">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Use your project credentials to continue</p>

          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="auth-submit" type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l4-4m0 0l-4-4m4 4H3m13-4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                  </svg>
                  Login to Dashboard
                </>
              )}
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
