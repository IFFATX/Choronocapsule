// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      // Not logged in, redirect to login
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
      <h1>Welcome, {user.name}!</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Country:</strong> {user.country}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <button onClick={handleLogout} style={{ marginTop: "20px", padding: "10px 20px" }}>
        Logout
      </button>
    </div>
  );
}



