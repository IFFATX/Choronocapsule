//dashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import '../styles/dashboard.css';
import '../styles/countdown.css';
import CountdownTimer from "../components/CountdownTimer";
import Logo from "../components/Logo";
import NotificationBell from "../components/NotificationBell";
import BadgeDisplay from "../components/BadgeDisplay";

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
        const res = await axios.get("http://localhost:5001/api/capsules", config);
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
        await axios.delete(`http://localhost:5001/api/capsules/${capsuleId}`, {
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
          <NotificationBell />
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

          <button className="sidebar-btn" onClick={() => setActivePage("badges")}>
            Achievements
          </button>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #51cf66 0%, #2ecc71 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    color: '#fff',
                    fontWeight: '900',
                    border: '5px solid #4ecdc4',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.15)'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 8px 0', 
                      fontSize: '28px', 
                      fontWeight: '700',
                      color: '#4ecdc4',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>{user.name}</h3>
                    <p style={{ 
                      margin: '0', 
                      color: '#ff8e53', 
                      fontSize: '16px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>User Profile</p>
                  </div>
                </div>

                <div style={{ borderTop: '4px solid #ffd93d', paddingTop: '25px' }}>
                  <h4 style={{ 
                    marginBottom: '20px', 
                    color: '#ff6b6b',
                    fontSize: '22px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textAlign: 'center'
                  }}>Account Information</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ 
                      padding: '18px', 
                      background: 'linear-gradient(135deg, #ffd93d 0%, #ffc107 100%)', 
                      borderRadius: '18px',
                      border: '3px solid #ff8e53',
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '13px', 
                        color: 'white', 
                        textTransform: 'uppercase', 
                        fontWeight: '700',
                        letterSpacing: '1px'
                      }}>Email Address</p>
                      <p style={{ 
                        margin: '0', 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: 'white'
                      }}>{user.email}</p>
                    </div>
                    
                    <div style={{ 
                      padding: '18px', 
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44b8ac 100%)', 
                      borderRadius: '18px',
                      border: '3px solid #ffd93d',
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '13px', 
                        color: 'white', 
                        textTransform: 'uppercase', 
                        fontWeight: '700',
                        letterSpacing: '1px'
                      }}>Member Since</p>
                      <p style={{ 
                        margin: '0', 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: 'white'
                      }}>{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ 
                      padding: '18px', 
                      background: 'linear-gradient(135deg, #ff8e53 0%, #ff6b6b 100%)', 
                      borderRadius: '18px',
                      border: '3px solid #4ecdc4',
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '13px', 
                        color: 'white', 
                        textTransform: 'uppercase', 
                        fontWeight: '700',
                        letterSpacing: '1px'
                      }}>Total Capsules</p>
                      <p style={{ 
                        margin: '0', 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: 'white'
                      }}>{capsules.length}</p>
                    </div>
                    
                    <div style={{ 
                      padding: '18px', 
                      background: 'linear-gradient(135deg, #51cf66 0%, #2ecc71 100%)', 
                      borderRadius: '18px',
                      border: '3px solid #ff6b6b',
                      boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
                    }}>
                      <p style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '13px', 
                        color: 'white', 
                        textTransform: 'uppercase', 
                        fontWeight: '700',
                        letterSpacing: '1px'
                      }}>Account Status</p>
                      <p style={{ 
                        margin: '0', 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: 'white'
                      }}>✓ Active</p>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: '4px solid #4ecdc4', marginTop: '25px', paddingTop: '25px', textAlign: 'center' }}>
                  <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <button onClick={() => setActivePage("settings")} style={{
                      padding: '15px 40px',
                      background: 'linear-gradient(135deg, #51cf66 0%, #2ecc71 100%)',
                      color: 'white',
                      border: '3px solid #4ecdc4',
                      borderRadius: '18px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '900',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      transition: 'all 0.3s ease',
                      boxShadow: '4px 4px 0 rgba(0,0,0,0.1)'
                    }} onMouseOver={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #ffd93d 0%, #ffc107 100%)';
                      e.target.style.borderColor = '#ff8e53';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '5px 5px 0 rgba(0,0,0,0.15)';
                    }} onMouseOut={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #51cf66 0%, #2ecc71 100%)';
                      e.target.style.borderColor = '#4ecdc4';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.1)';
                    }}>
                      Edit Profile →
                    </button>
                  </Link>
                </div>
              </div>

              <div style={{ 
                marginTop: '40px', 
                background: 'linear-gradient(135deg, #fff 0%, #fffbf0 100%)', 
                padding: '35px', 
                borderRadius: '25px', 
                color: '#333', 
                boxShadow: '0 6px 0 rgba(0,0,0,0.1), 0 12px 30px rgba(0,0,0,0.15)',
                border: '5px solid #ff6b6b'
              }}>
                <h3 style={{ 
                  margin: '0 0 20px 0', 
                  fontSize: '32px', 
                  fontWeight: '900', 
                  color: '#ff6b6b',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>✨ About ChronoCapsule</h3>
                <p style={{ 
                  margin: '0 0 25px 0', 
                  fontSize: '18px', 
                  lineHeight: '1.8', 
                  color: '#555',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  ChronoCapsule is your personal time-locked vault for preserving memories and goals.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #ffd93d 0%, #ffc107 100%)', 
                    padding: '20px', 
                    borderRadius: '20px', 
                    border: '4px solid #ff8e53',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                    transform: 'rotate(-1deg)',
                    transition: 'all 0.3s ease'
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>🔐 Lock Memories</p>
                    <p style={{ margin: '0', fontSize: '15px', color: '#fff', fontWeight: '600', lineHeight: '1.5' }}>Seal your cherished moments and unlock them at a future date</p>
                  </div>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44b8ac 100%)', 
                    padding: '20px', 
                    borderRadius: '20px', 
                    border: '4px solid #ffd93d',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                    transform: 'rotate(1deg)',
                    transition: 'all 0.3s ease'
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>🎯 New Year Resolutions</p>
                    <p style={{ margin: '0', fontSize: '15px', color: '#fff', fontWeight: '600', lineHeight: '1.5' }}>Set goals and remind yourself of your aspirations when they unlock</p>
                  </div>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #ff8e53 0%, #ff6b6b 100%)', 
                    padding: '20px', 
                    borderRadius: '20px', 
                    border: '4px solid #4ecdc4',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                    transform: 'rotate(1deg)',
                    transition: 'all 0.3s ease'
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>📝 Motivational Notes</p>
                    <p style={{ margin: '0', fontSize: '15px', color: '#fff', fontWeight: '600', lineHeight: '1.5' }}>Write future reminders to inspire and encourage yourself</p>
                  </div>
                  <div style={{ 
                    background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', 
                    padding: '20px', 
                    borderRadius: '20px', 
                    border: '4px solid #ff6b6b',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.1)',
                    transform: 'rotate(-1deg)',
                    transition: 'all 0.3s ease'
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>⏰ Time-Locked</p>
                    <p style={{ margin: '0', fontSize: '15px', color: '#fff', fontWeight: '600', lineHeight: '1.5' }}>Capsules stay sealed until your chosen unlock date arrives</p>
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
                      padding: "16px 20px",
                      borderRadius: "18px",
                      border: "3px solid #4ecdc4",
                      fontSize: "16px",
                      fontWeight: "700",
                      transition: "all 0.3s",
                      outline: "none",
                      backgroundColor: "#fff",
                      color: "#333",
                      boxShadow: "3px 3px 0 rgba(0,0,0,0.1)"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#ffd93d";
                      e.target.style.boxShadow = "4px 4px 0 rgba(0,0,0,0.15)";
                      e.target.style.transform = "translateY(-2px)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#4ecdc4";
                      e.target.style.boxShadow = "3px 3px 0 rgba(0,0,0,0.1)";
                      e.target.style.borderColor = "#4ecdc4";
                      e.target.style.boxShadow = "3px 3px 0 rgba(0,0,0,0.1)";
                      e.target.style.transform = "translateY(0)";
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
                                padding: '14px 18px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)',
                                color: 'white',
                                border: '3px solid #ff8e53',
                                borderRadius: '16px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '900',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                transition: 'all 0.3s ease',
                                boxShadow: '3px 3px 0 rgba(0,0,0,0.1)'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #ffd93d 0%, #ffc107 100%)';
                                e.target.style.borderColor = '#ffd93d';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '4px 4px 0 rgba(0,0,0,0.15)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%)';
                                e.target.style.borderColor = '#ff8e53';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '3px 3px 0 rgba(0,0,0,0.1)';
                              }}
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

          {activePage === "badges" && (
            <>
              <h2 className="welcome-text">Your Achievements 🏆</h2>
              <BadgeDisplay />
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
