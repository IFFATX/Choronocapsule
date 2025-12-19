//dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import '../styles/dashboard.css';
import '../styles/countdown.css';
import CountdownTimer from "../components/CountdownTimer";
import Logo from "../components/Logo";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [capsules, setCapsules] = useState([]);

  const [activePage, setActivePage] = useState("profile");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
  });

  const [editMessage, setEditMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(stored);
    setUser(userData);
    setEditFormData({ name: userData.name, email: userData.email });

    const fetchCapsules = async () => {
      try {
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        const res = await axios.get("http://localhost:5000/api/capsules", config);
        setCapsules(res.data);
      } catch (err) {
        console.error("Error fetching capsules:", err);
      }
    };
    fetchCapsules();

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setEditMessage("");

    // Update localStorage
    const updatedUser = { ...user, name: editFormData.name, email: editFormData.email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    setEditMessage("Profile updated successfully!");
    setTimeout(() => setEditMessage(""), 3000);
  };

  const handleDeleteDraft = async (capsuleId) => {
    if (window.confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/capsules/${capsuleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Remove from local state
        setCapsules(capsules.filter(c => c._id !== capsuleId));
        alert("Draft deleted successfully!");
      } catch (err) {
        console.error("Error deleting draft:", err);
        alert("Error deleting draft: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (!user) return <p className="loading-text">Loading...</p>;

  // Calculate report metrics
  const completedCapsules = capsules.filter(c => c.status === 'released').length;
  const draftCapsules = capsules.filter(c => c.status === 'draft').length;
  const lockedCapsules = capsules.filter(c => c.status === 'locked').length;
  const totalCapsules = capsules.length;
  const progressPercentage = totalCapsules > 0 
    ? Math.round((completedCapsules / totalCapsules) * 100) 
    : 0;

  // Filter capsules based on search query
  const filteredCapsules = capsules.filter(capsule =>
    capsule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    capsule.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Logo size={40} />
          <h1 className="logo">ChronoCapsule</h1>
        </div>
        <div className="navbar-actions">
          <button className="dark-mode-btn" onClick={toggleDarkMode} title="Toggle dark mode">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Menu</h3>
          
          <button className="sidebar-btn" onClick={() => setActivePage("profile")}>
            My Profile
          </button>

          {/* --- NEW SIDEBAR BUTTON --- */}
          <button className="sidebar-btn" onClick={() => setActivePage("capsules")}>
            My Capsules
          </button>
          {/* -------------------------- */}

          <button className="sidebar-btn" onClick={() => setActivePage("reports")}>
            View Reports
          </button>
          <button className="sidebar-btn" onClick={() => setActivePage("settings")}>
            Settings
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <div className="dashboard-content">

          {/* PROFILE PAGE */}
          {activePage === "profile" && (
            <>
              <h2 className="welcome-text">Welcome {user.name} 👋</h2>

              <div className="profile-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    color: '#fff'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{user.name}</h3>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>User Profile</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                  <h4 style={{ marginBottom: '15px', color: '#333' }}>Account Information</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ padding: '15px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Email Address</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>{user.email}</p>
                    </div>
                    
                    <div style={{ padding: '15px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Member Since</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ padding: '15px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Total Capsules</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '500' }}>{capsules.length}</p>
                    </div>
                    
                    <div style={{ padding: '15px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase', fontWeight: 'bold' }}>Account Status</p>
                      <p style={{ margin: '0', fontSize: '16px', fontWeight: '500', color: '#4CAF50' }}>✓ Active</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #ddd', marginTop: '20px', paddingTop: '20px', textAlign: 'center' }}>
                  <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button onClick={() => setActivePage("settings")} style={{
                      padding: '12px 30px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }} onMouseOver={(e) => e.target.style.backgroundColor = '#2E7D32'} onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}>
                      Edit Profile →
                    </button>
                  </Link>
                </div>
              </div>

              <div style={{ marginTop: '40px', background: 'linear-gradient(135deg, #ffc0cb 0%, #ffb6d9 100%)', padding: '30px', borderRadius: '12px', color: '#333', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>✨ About ChronoCapsule</h3>
                <p style={{ margin: '0 0 15px 0', fontSize: '16px', lineHeight: '1.6', opacity: '1', color: '#333' }}>
                  ChronoCapsule is your personal time-locked vault for preserving memories and goals.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', opacity: '1', color: '#333' }}>🔐 Lock Memories</p>
                    <p style={{ margin: '0', fontSize: '13px', opacity: '1', color: '#333' }}>Seal your cherished moments and unlock them at a future date</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', opacity: '1', color: '#333' }}>🎯 New Year Resolutions</p>
                    <p style={{ margin: '0', fontSize: '13px', opacity: '1', color: '#333' }}>Set goals and remind yourself of your aspirations when they unlock</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', opacity: '1', color: '#333' }}>📝 Motivational Notes</p>
                    <p style={{ margin: '0', fontSize: '13px', opacity: '1', color: '#333' }}>Write future reminders to inspire and encourage yourself</p>
                  </div>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', padding: '15px', borderRadius: '8px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)' }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: 'bold', opacity: '1', color: '#333' }}>⏰ Time-Locked</p>
                    <p style={{ margin: '0', fontSize: '13px', opacity: '1', color: '#333' }}>Capsules stay sealed until your chosen unlock date arrives</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activePage === "capsules" && (
            <>
              <h2 className="welcome-text" style={{ marginBottom: "20px" }}>Your Time Capsules</h2>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", gap: "15px" }}>
                <div style={{ flex: 1, maxWidth: "500px" }}>
                  <input
                    type="text"
                    placeholder="🔍 Search capsules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      borderRadius: "8px",
                      border: "2px solid #ddd",
                      fontSize: "14px",
                      transition: "all 0.3s",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#333"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ff4444";
                      e.target.style.boxShadow = "0 0 0 3px rgba(255, 68, 68, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#ddd";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <Link to="/create">
                    <button className="create-btn">+ Seal New Capsule</button>
                </Link>
              </div>

              <div className="capsule-grid">
                {filteredCapsules.length > 0 ? (
                  filteredCapsules.map((capsule) => (
                    <div key={capsule._id} className="capsule-card">
                      <div className="card-header">
                        <span className={`status-badge ${capsule.status}`}>
                          {capsule.status.toUpperCase()}
                        </span>
                        <span className="date-text">
                           {new Date(capsule.releaseDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h3>{capsule.title}</h3>
                      <p className="card-desc">
                        {capsule.description.substring(0, 60)}...
                      </p>
                      <CountdownTimer releaseDate={capsule.releaseDate} />
                      
                      {capsule.status === 'draft' && (
                          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <Link to={`/edit/${capsule._id}`}>
                              <button className="action-btn" style={{ flex: 1 }}>✏️ Edit Draft</button>
                            </Link>
                            <button 
                              onClick={() => handleDeleteDraft(capsule._id)}
                              style={{
                                padding: '10px 15px',
                                backgroundColor: '#f75656',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                              }}
                              onMouseOver={(e) => e.target.style.backgroundColor = '#ec4343'}
                              onMouseOut={(e) => e.target.style.backgroundColor = '#f75656'}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                      )}
                      {capsule.status === 'locked' && (
                          <div className="lock-message">🔒 Locked</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>{searchQuery ? "No capsules match your search." : "You haven't created any capsules yet."}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activePage === "reports" && (
            <>
              <h2 className="welcome-text">Your Reports 📊</h2>

              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Capsules Created</h4>
                  <p>{totalCapsules}</p>
                </div>

                <div className="stat-card">
                  <h4>Released</h4>
                  <p>{completedCapsules}</p>
                </div>

                <div className="stat-card">
                  <h4>Pending (Locked)</h4>
                  <p>{lockedCapsules}</p>
                </div>

                <div className="stat-card">
                  <h4>Drafts</h4>
                  <p>{draftCapsules}</p>
                </div>

                <div className="stat-card">
                  <h4>Completion Rate</h4>
                  <p>{progressPercentage}%</p>
                </div>
              </div>
            </>
          )}

          {activePage === "settings" && (
            <>
              <h2 className="welcome-text">Settings ⚙️</h2>
              
              <div className="profile-card">
                <h3>Edit Profile</h3>
                <form onSubmit={handleSaveProfile}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      style={{ 
                        width: "100%", 
                        padding: "10px", 
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                      }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      style={{ 
                        width: "100%", 
                        padding: "10px", 
                        marginBottom: "15px",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                      }}
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem"
                    }}
                  >
                    Save Changes
                  </button>
                </form>

                {editMessage && (
                  <p style={{ 
                    marginTop: "15px", 
                    color: "#4CAF50", 
                    fontWeight: "bold" 
                  }}>
                    {editMessage}
                  </p>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      <footer className="dashboard-footer">
        © 2025 Chrono | All rights reserved.
      </footer>

    </div>
  );
}
