import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import '../styles/dashboard.css';
import Logo from "../components/Logo";

const ViewCapsule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedMedia(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        
        setCapsule(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching capsule");
        navigate("/dashboard");
      }
    };

    fetchCapsule();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this capsule? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5001/api/capsules/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Capsule deleted successfully!");
        navigate("/dashboard");
      } catch (err) {
        console.error("Error deleting capsule:", err);
        alert("Error deleting capsule: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <div className="loading-text" style={{ textAlign: "center", marginTop: "100px" }}>Unlocking your memories...</div>;

  if (!capsule) return null;

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

      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
        <div className="profile-card">
          <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "4px solid #ffd93d", paddingBottom: "20px" }}>
            <h1 style={{ fontSize: "2.8rem", color: "#4ecdc4", marginBottom: "10px", fontWeight: "900", textTransform: "uppercase", textShadow: "3px 3px 0 rgba(0,0,0,0.1)" }}>{capsule.title}</h1>
            <p className="date-text" style={{ fontSize: "1rem" }}>
              🔓 Unlocked on {new Date(capsule.releaseDate).toLocaleString()}
            </p>
          </div>

          <div style={{ 
            background: "linear-gradient(135deg, #fffbf0 0%, #fff 100%)", 
            padding: "30px", 
            borderRadius: "20px", 
            marginBottom: "30px", 
            lineHeight: "1.8",
            fontSize: "1.2rem",
            color: "#333",
            whiteSpace: "pre-wrap",
            border: "3px solid #ff8e53",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            fontWeight: "500"
          }}>
            {capsule.description}
          </div>

          {capsule.files && capsule.files.length > 0 && (
            <div style={{ marginBottom: "40px" }}>
              <h3 style={{ 
                color: "#ff6b6b", 
                fontWeight: "900", 
                textTransform: "uppercase", 
                letterSpacing: "1px",
                marginBottom: "20px",
                fontSize: "1.4rem"
              }}>📦 Attached Memories</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {capsule.files.map((file, index) => {
                  const isImage = file.match(/\.(jpeg|jpg|png|gif|webp)$/i);
                  const isVideo = file.match(/\.(mp4|mov|avi|webm)$/i);
                  const isAudio = file.match(/\.(mp3|wav|ogg)$/i);
                  const isPdf = file.match(/\.pdf$/i);
                  const fileUrl = `http://localhost:5001/${file}`;

                  return (
                    <div key={index} style={{ 
                      position: 'relative', 
                      width: '220px', 
                      height: '220px', 
                      border: '4px solid #4ecdc4', 
                      borderRadius: '20px', 
                      overflow: 'hidden', 
                      boxShadow: "4px 4px 0 rgba(0,0,0,0.1)", 
                      background: '#fff',
                      transition: "transform 0.3s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px) rotate(1deg)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0) rotate(0)"}
                    >
                      {isImage ? (
                        <img 
                          src={fileUrl} 
                          alt="memory" 
                          onClick={() => setSelectedMedia(fileUrl)}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} 
                        />
                      ) : isVideo ? (
                        <div 
                          onClick={() => setSelectedMedia(fileUrl)}
                          style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer', background: '#000' }}
                        >
                          <video src={fileUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '50px',
                            color: 'white',
                            textShadow: '0 0 10px rgba(0,0,0,0.7)',
                            pointerEvents: 'none'
                          }}>
                            ▶️
                          </div>
                        </div>
                      ) : isAudio ? (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
                            <span style={{ fontSize: '40px', marginBottom: '10px' }}>🎵</span>
                            <audio controls src={fileUrl} style={{ width: '90%' }} />
                        </div>
                      ) : isPdf ? (
                        <div 
                          onClick={() => setSelectedMedia(fileUrl)}
                          style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#fff' }}
                        >
                            <span style={{ fontSize: '50px', marginBottom: '10px' }}>📄</span>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#555', textTransform: "uppercase" }}>View PDF</span>
                        </div>
                      ) : (
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#333', background: '#eee' }}>
                          <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '30px' }}>📎</span>
                            <p style={{ fontSize: '12px', marginTop: '5px', fontWeight: "700" }}>Download</p>
                          </div>
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: "40px", textAlign: "center", borderTop: "4px solid #4ecdc4", paddingTop: "30px", display: "flex", justifyContent: "center", gap: "20px" }}>
            <button 
              onClick={() => navigate('/dashboard')}
              className="action-btn"
              style={{ flex: 1, padding: "15px" }}
            >
              🏠 Close & Return
            </button>

            <button 
              onClick={handleDelete}
              className="create-btn"
              style={{ flex: 1, padding: "15px" }}
            >
              🗑️ Delete Capsule
            </button>
          </div>
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
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMedia(null);
            }}
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
              zIndex: 3000,
              transition: 'all 0.2s',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = "rgba(255,255,255,0.4)";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.transform = "scale(1)";
            }}
            title="Close (Esc)"
          >
            &times;
          </button>
          
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedMedia.match(/\.(mp4|mov|avi|webm)$/i) ? (
                <video 
                controls 
                autoPlay
                src={selectedMedia} 
                style={{ maxWidth: '100%', maxHeight: '100%', outline: 'none' }} 
                />
            ) : selectedMedia.match(/\.pdf$/i) ? (
                <iframe 
                src={selectedMedia} 
                style={{ width: '80%', height: '90%', background: 'white', border: 'none' }} 
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

export default ViewCapsule;
