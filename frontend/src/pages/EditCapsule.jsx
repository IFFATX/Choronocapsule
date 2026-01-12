import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/dashboard.css';
import Logo from "../components/Logo";

const EditCapsule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
  });
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState("draft");
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
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

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.get(`http://localhost:5001/api/capsules/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const capsule = res.data;
        // Format date to YYYY-MM-DDTHH:mm for datetime-local input
        const date = new Date(capsule.releaseDate);
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        const formattedDate = localDate.toISOString().slice(0, 16);

        setFormData({
          title: capsule.title,
          description: capsule.description,
          releaseDate: formattedDate,
        });
        setExistingFiles(capsule.files || []);
        setSubmissionStatus(capsule.status || "draft");
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching capsule");
        navigate("/dashboard");
      }
    };

    fetchCapsule();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNewFiles(e.target.files);
  };

  const handleRemoveExistingFile = (fileToRemove) => {
    setExistingFiles(existingFiles.filter(f => f !== fileToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("releaseDate", formData.releaseDate);
      formDataToSend.append("status", submissionStatus);
      
      // Append existing files that we want to keep
      existingFiles.forEach(file => {
        formDataToSend.append("remainingFiles", file);
      });

      // Append new files
      for (let i = 0; i < newFiles.length; i++) {
        formDataToSend.append("files", newFiles[i]);
      }

      await axios.put(`http://localhost:5001/api/capsules/${id}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          // Axios automatically sets Content-Type for FormData
        }
      });
      
      alert(submissionStatus === 'locked' ? "Capsule Locked Successfully!" : "Draft Updated Successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error updating capsule: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="loading-text" style={{ textAlign: "center", marginTop: "100px" }}>Loading Capsule...</div>;

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

      <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px" }}>
        <h2 className="welcome-text" style={{ textAlign: "center" }}>Edit Capsule</h2>
        
        <div className="profile-card">
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900", color: "#ff6b6b", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
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

            {/* Existing Files Preview */}
            {existingFiles.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "900", color: "#ff6b6b", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Current Files</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
                  {existingFiles.map((file, index) => {
                    const isImage = file.match(/\.(jpeg|jpg|png|gif)$/i);
                    const isVideo = file.match(/\.(mp4|mov|avi)$/i);
                    const isAudio = file.match(/\.(mp3|wav)$/i);
                    const isPdf = file.match(/\.pdf$/i);
                    const fileUrl = `http://localhost:5001/${file}`;

                    return (
                      <div key={index} style={{ position: 'relative', width: '130px', height: '130px', border: '3px solid #4ecdc4', borderRadius: '15px', overflow: 'hidden', boxShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}>
                        {isImage ? (
                          <img 
                            src={fileUrl} 
                            alt="preview" 
                            onClick={() => setSelectedMedia(fileUrl)}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                          />
                        ) : isVideo ? (
                          <div 
                            onClick={() => setSelectedMedia(fileUrl)}
                            style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer', background: "#000" }}
                          >
                            <video src={fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              fontSize: '30px',
                              pointerEvents: 'none'
                            }}>
                              ▶️
                            </div>
                          </div>
                        ) : isAudio ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: "#fff" }}>
                             <span style={{ fontSize: '24px' }}>🎵</span>
                             <audio controls src={fileUrl} style={{ width: '100%', maxWidth: '110px' }} />
                          </div>
                        ) : isPdf ? (
                          <div 
                            onClick={() => setSelectedMedia(fileUrl)}
                            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: "#fff" }}
                          >
                             <span style={{ fontSize: '30px' }}>📄</span>
                             <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#555' }}>PDF</span>
                          </div>
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', background: '#eee' }}>
                            File
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingFile(file)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: '#ff6b6b',
                            color: 'white',
                            border: '2px solid white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            boxShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "900", color: "#ff6b6b", textTransform: "uppercase", fontSize: "14px", letterSpacing: "1px" }}>Add New Files</label>
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
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
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
                <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')}
                    className="sidebar-btn"
                    style={{ flex: 1, margin: 0 }}
                >
                  Cancel
                </button>
            </div>
          </form>
        </div>
      </div>

      {/* Full Screen Media Modal */}
      {selectedMedia && (
        <div 
          onClick={() => setSelectedMedia(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            cursor: 'pointer',
            padding: '20px'
          }}
        >
          <button 
            onClick={() => setSelectedMedia(null)}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              background: 'rgba(255,255,255,0.2)',
              border: '2px solid white',
              color: 'white',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '30px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000
            }}
          >
            &times;
          </button>
          
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedMedia.match(/\.(mp4|mov|avi)$/i) ? (
                <video 
                controls 
                autoPlay
                src={selectedMedia} 
                style={{ maxWidth: '100%', maxHeight: '100%' }} 
                />
            ) : selectedMedia.match(/\.pdf$/i) ? (
                <iframe 
                src={selectedMedia} 
                style={{ width: '80%', height: '90%', background: 'white' }} 
                />
            ) : (
                <img 
                src={selectedMedia} 
                alt="Full size" 
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                />
            )}
          </div>
        </div>
      )}

      <footer className="dashboard-footer" style={{ marginTop: "40px" }}>
        © 2025 Chrono | Preserving your journey.
      </footer>
    </div>
  );
};

export default EditCapsule;