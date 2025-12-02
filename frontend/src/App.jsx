// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import CreateCapsule from "./pages/CreateCapsule"; // <--- 1. Import the new page
import './App.css';

function App() {
  // Simple auth check using localStorage
  // Note: Ensure your Login page saves the item as "token" (lowercase) to match this check
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Redirect to dashboard if already logged in */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/login" /> : <Login />}
        />
        
        {/* Protect dashboard route */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* --- ADDED THIS SECTION --- */}
        {/* Protect Create Capsule route */}
        <Route
          path="/create"
          element={isAuthenticated ? <CreateCapsule /> : <Navigate to="/login" />}
        />
        {/* -------------------------- */}
        
        {/* Catch all unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;