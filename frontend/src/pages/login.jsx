// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api"; // Assuming login API function

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await loginUser(formData);
      setMessage("Login successful!");

      // Log to console to verify if data is stored correctly
      console.log("Login Response:", response);

      // Store token and user data in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Check localStorage to see if data is saved correctly
      console.log("Token in LocalStorage:", localStorage.getItem("token"));
      console.log("User in LocalStorage:", JSON.parse(localStorage.getItem("user")));

      // Redirect to Dashboard after login
      navigate("/dashboard"); // This should redirect to dashboard
    } catch (err) {
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {message && <p className="message">{message}</p>}

      <p>
        Don't have an account? <a href="/register">Sign up</a>
      </p>
    </div>
  );
}






