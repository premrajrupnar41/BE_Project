import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CML.css";

function CML() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem("username");

  const handleImage = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const predictDisease = async () => {
    if (!image) {
      alert("Please upload MRI image");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-cnn", {
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
          username: username
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
    navigate("/", { replace: true });
  };

  // Tumor type descriptions
  const tumorDescriptions = {
    "glioma": "A type of brain tumor that arises from glial cells. It can vary in grade from benign to highly aggressive.",
    "meningioma": "A tumor that develops from the meninges (membranes surrounding the brain). Usually benign but can be serious.",
    "pituitary": "A tumor of the pituitary gland, located at the base of the brain. Often affects hormone production.",
    "no_tumor": "No tumor detected. The brain MRI appears normal."
  };

  return (
    <div className="cml-container">
      <div className="cml-header">
        <div className="header-content">
          <h1>🧮 Classical CNN Brain Tumor Analysis</h1>
          <p className="user-badge">User: {username}</p>
        </div>
        <button className="back-btn" onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="cml-content">
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
              <p className="upload-hint">PNG, JPG, GIF up to 10MB</p>
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

          <div className="controls">
            <button 
              className="predict-btn" 
              onClick={predictDisease}
              disabled={!image || loading}
            >
              {loading ? "🔄 Analyzing..." : "🚀 Analyze with CNN"}
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
              <p>Running CNN Analysis... This may take a few seconds</p>
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
                  <label>Tumor Type:</label>
                  <div className="tumor-type">
                    {result.tumor_type.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="tumor-description">
                <h3>About {result.tumor_type.replace('_', ' ').toUpperCase()}:</h3>
                <p>{tumorDescriptions[result.tumor_type] || "Classification complete."}</p>
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
  );
}

export default CML;
