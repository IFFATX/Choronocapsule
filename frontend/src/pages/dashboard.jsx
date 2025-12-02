import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/dashboard.css'; // Make sure this path matches your project

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!stored || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(stored));
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
        <button className="sidebar-btn">Edit Profile</button>
        <button className="sidebar-btn">View Reports</button>
        <button className="sidebar-btn">Settings</button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        
        <h2 className="welcome-text">Welcome {user.name} 👋</h2>

        <div className="profile-card">
          <h3>Your Profile</h3>
          <div className="profile-grid">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Country:</strong> {user.country}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Joined:</strong> {new Date().toDateString()}</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><h4>Tasks Completed</h4><p>0</p></div>
          <div className="stat-card"><h4>Pending Tasks</h4><p>0</p></div>
          <div className="stat-card"><h4>Total Hours</h4><p>0 Hrs</p></div>
          <div className="stat-card"><h4>Progress</h4><p>0%</p></div>
        </div>

      </div>

    </div>

    <footer className="dashboard-footer">
      © 2025 Chrono | All rights reserved.
    </footer>

  </div>
);

}