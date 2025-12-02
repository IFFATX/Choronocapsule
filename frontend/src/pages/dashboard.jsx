import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [capsules, setCapsules] = useState([]);

  const [activePage, setActivePage] = useState("profile");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(stored));

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

  if (!user) return <p className="loading-text">Loading...</p>;

  return (
    <div className="dashboard-container">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">Chrono Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>

      <div className="dashboard-layout">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <h3 className="sidebar-title">Menu</h3>
          
          <button className="sidebar-btn" onClick={() => setActivePage("profile")}>
            Edit Profile
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
                <h3>Your Profile</h3>
                <div className="profile-grid">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Joined:</strong> {new Date().toDateString()}</p>
                </div>
              </div>
            </>
          )}

          {activePage === "capsules" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 className="welcome-text">Your Time Capsules</h2>
                <Link to="/create">
                    <button className="create-btn">+ Seal New Capsule</button>
                </Link>
              </div>

              <div className="capsule-grid">
                {capsules.length > 0 ? (
                  capsules.map((capsule) => (
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
                      
                      {capsule.status === 'draft' && (
                          <Link to={`/edit/${capsule._id}`}>
                            <button className="action-btn">Edit Draft</button>
                          </Link>
                      )}
                      {capsule.status === 'locked' && (
                          <div className="lock-message">🔒 Locked</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>You haven't created any capsules yet.</p>
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
                  <h4>Tasks Completed</h4>
                  <p>{capsules.length}</p>
                </div>

                <div className="stat-card">
                  <h4>Pending Tasks</h4>
                  <p>0</p>
                </div>

                <div className="stat-card">
                  <h4>Total Hours</h4>
                  <p>0 Hrs</p>
                </div>

                <div className="stat-card">
                  <h4>Progress</h4>
                  <p>0%</p>
                </div>
              </div>
            </>
          )}

          {activePage === "settings" && (
            <>
              <h2 className="welcome-text">Settings ⚙️</h2>
              <p>Settings options will be added here.</p>
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