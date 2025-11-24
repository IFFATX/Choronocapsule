// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import for navigation
import { loginUser } from "../api/api";

export default function Login() {
  const navigate = useNavigate(); // ✅ initialize navigate
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
      const res = await loginUser(formData);
      setMessage(res.message || "Login successful!");
      setFormData({ email: "", password: "" });

      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);

      // ✅ Navigate to dashboard after login
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}



