import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/dashboard.css';
import Logo from "../components/Logo";

const CreateCapsule = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
  });
  const [files, setFiles] = useState([]);

  const [submissionStatus, setSubmissionStatus] = useState("draft");
  const navigate = useNavigate();
  const dateInputRef = useRef(null);

  const handleShowPicker = () => {
    if (dateInputRef.current) {
      if (dateInputRef.current.showPicker) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a capsule");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("releaseDate", formData.releaseDate);
      formDataToSend.append("status", submissionStatus);
      
      for (let i = 0; i < files.length; i++) {
        formDataToSend.append("files", files[i]);
      }

      // NOTE: Ensure this matches your backend URL/Port
      const res = await axios.post("http://localhost:5001/api/capsules", formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
        }
      });
      
      console.log("Response:", res.data);
      
      // Trigger notification refresh in case badges were earned
      window.dispatchEvent(new Event('badgeEarned'));
      
      alert(submissionStatus === 'locked' ? "Capsule Locked Successfully!" : "Draft Saved Successfully!");
      navigate("/dashboard"); // Redirect to dashboard (if you have one)
    } catch (err) {
      console.error(err);
      alert("Error creating capsule: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="navbar" style={{ margin: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={40} />
          <h1 className="logo">ChronoCapsule</h1>
        </div>
        <div className="navbar-actions">
          <button className="logout-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
        </div>
      </nav>

      <div style={{ maxWidth: "600px", margin: "40px auto", padding: "0 20px" }}>
        <h2 className="welcome-text" style={{ textAlign: "center" }}>Create New Capsule</h2>
        
        <div className="profile-card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900", color: "#ff6b6b", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Name your capsule..."
                style={{ 
                  width: "100%", 
                  padding: "14px", 
                  borderRadius: "15px", 
                  border: "3px solid #4ecdc4",
                  fontSize: "16px",
                  fontWeight: "600",
                  outline: "none",
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.1)"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900", color: "#ff6b6b", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Message</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write something for the future..."
                style={{ 
                  width: "100%", 
                  height: "120px", 
                  padding: "14px", 
                  borderRadius: "15px", 
                  border: "3px solid #ffd93d",
                  fontSize: "16px",
                  fontWeight: "600",
                  outline: "none",
                  boxShadow: "3px 3px 0 rgba(0,0,0,0.1)",
                  resize: "none"
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900", color: "#ff6b6b", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Unlock Date & Time</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="datetime-local"
                  name="releaseDate"
                  ref={dateInputRef}
                  value={formData.releaseDate}
                  onChange={handleChange}
                  style={{ 
                    flex: 1, 
                    padding: "14px", 
                    borderRadius: "15px", 
                    border: "3px solid #ff8e53",
                    fontSize: "16px",
                    fontWeight: "600",
                    outline: "none",
                    boxShadow: "3px 3px 0 rgba(0,0,0,0.1)"
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={handleShowPicker}
                  style={{
                    padding: "0 20px",
                    borderRadius: "15px",
                    border: "3px solid #ff8e53",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: "20px",
                    boxShadow: "3px 3px 0 rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#fffbf0";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#fff";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                  title="Choose Date & Time"
                >
                  📅
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900", color: "#ff6b6b", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Attach Files</label>
              <div style={{ 
                border: "3px dashed #4ecdc4", 
                padding: "20px", 
                borderRadius: "15px", 
                textAlign: "center",
                background: "rgba(78, 205, 196, 0.05)"
              }}>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  style={{ width: "100%", cursor: "pointer" }}
                />
                <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#666", fontWeight: "600" }}>
                  Images, Videos, Audio, or PDFs
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <button 
                type="submit" 
                onClick={() => setSubmissionStatus("draft")}
                className="action-btn"
                style={{ flex: 1, background: "linear-gradient(135deg, #eee 0%, #ccc 100%)", color: "#333", border: "3px solid #bbb" }}
              >
                💾 Save Draft
              </button>
              <button 
                type="submit" 
                onClick={() => setSubmissionStatus("locked")}
                className="create-btn"
                style={{ flex: 1 }}
              >
                🔒 Lock Capsule
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <footer className="dashboard-footer" style={{ marginTop: "40px" }}>
        © 2025 Chrono | Preserving your journey.
      </footer>
    </div>
  );
};

export default CreateCapsule;