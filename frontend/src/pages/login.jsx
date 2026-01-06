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
    <div style={{
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a2e',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        padding: '35px 50px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        zIndex: 1,
        border: '3px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '70px', 
            marginBottom: '12px'
          }}>🕐</div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '28px',
            color: '#1a1a2e',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>ChronoCapsule</h2>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: '15px',
            fontWeight: '500'
          }}>Unlock your time-locked memories ⏰</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#1a1a2e',
              fontWeight: '700',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '3px solid #eee',
                borderRadius: '15px',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: '#f9f9f9',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ff6b6b';
                e.target.style.background = '#fff';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#eee';
                e.target.style.background = '#f9f9f9';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#1a1a2e',
              fontWeight: '700',
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>🔒 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '15px 20px',
                border: '3px solid #eee',
                borderRadius: '15px',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: '#f9f9f9',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4ecdc4';
                e.target.style.background = '#fff';
                e.target.style.transform = 'scale(1.02)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#eee';
                e.target.style.background = '#f9f9f9';
                e.target.style.transform = 'scale(1)';
              }}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '16px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(255, 107, 107, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.02)';
            e.target.style.boxShadow = '0 12px 30px rgba(255, 107, 107, 0.6)';
            e.target.style.background = '#ff5252';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 8px 20px rgba(255, 107, 107, 0.4)';
            e.target.style.background = '#ff6b6b';
          }}>
            Let's Go! 🚀
          </button>
        </form>

        {message && (
          <p style={{ 
            marginTop: '20px', 
            padding: '15px',
            borderRadius: '12px',
            textAlign: 'center',
            background: message.includes('failed') ? '#ffe5e5' : '#e5ffe5',
            color: message.includes('failed') ? '#ff3333' : '#33cc33',
            fontWeight: '700',
            fontSize: '14px',
            border: `3px solid ${message.includes('failed') ? '#ffcccc' : '#ccffcc'}`
          }}>{message}</p>
        )}

        <div style={{ 
          textAlign: 'center', 
          marginTop: '25px',
          padding: '20px 0 0 0',
          borderTop: '2px dashed #e0e0e0'
        }}>
          <p style={{ 
            color: '#666',
            fontSize: '14px',
            margin: 0,
            fontWeight: '600'
          }}>
            New here? <a href="/register" style={{ 
              color: '#4ecdc4', 
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '15px'
            }}>Create Account →</a>
          </p>
        </div>
      </div>
    </div>
  );
}





