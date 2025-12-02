// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch user data when the component is mounted
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login"); // If no user is found in localStorage, redirect to login
    } else {
      setUser(userData); // Set user data if available
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear localStorage and navigate to login
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Navigate to login after logout
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user ? user.name : "Loading..."}</h1>

      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
