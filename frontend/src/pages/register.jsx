// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api"; // Assuming you have an API function to handle registration

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  // Clear form on component mount
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      const response = await registerUser(formData);
      setMessage("Registration successful!");

      // After registration, redirect to login page
      navigate("/login");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setMessage(errorMsg);
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
      background: '#0f3460',
      position: 'fixed',
      top: 0,
      left: 0,
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        padding: '35px 50px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 30px 90px rgba(0, 0, 0, 0.5)',
        position: 'relative',
        zIndex: 1,
        border: '3px solid rgba(255, 255, 255, 0.4)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            fontSize: '70px', 
            marginBottom: '12px'
          }}>🎯</div>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            fontSize: '27px',
            color: '#0f3460',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>Start Your Journey</h2>
          <p style={{ 
            color: '#666', 
            margin: 0,
            fontSize: '14px',
            fontWeight: '600'
          }}>Create memories that last forever 💫</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#0f3460',
              fontWeight: '700',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>👤 Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="off"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '3px solid #eee',
                borderRadius: '15px',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: '#f9f9f9',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#ffc371';
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

          <div style={{ marginBottom: '18px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#0f3460',
              fontWeight: '700',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
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

          <div style={{ marginBottom: '18px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#0f3460',
              fontWeight: '700',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>🔐 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '3px solid #eee',
                borderRadius: '15px',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: '#f9f9f9',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#c77dff';
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

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#0f3460',
              fontWeight: '700',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>✅ Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              style={{
                width: '100%',
                padding: '14px 18px',
                border: '3px solid #eee',
                borderRadius: '15px',
                fontSize: '15px',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box',
                background: '#f9f9f9',
                fontWeight: '500'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#06d6a0';
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
            background: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            fontSize: '16px',
            fontWeight: '800',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(78, 205, 196, 0.4)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px) scale(1.02)';
            e.target.style.boxShadow = '0 12px 30px rgba(78, 205, 196, 0.6)';
            e.target.style.background = '#3dbdb4';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 8px 20px rgba(78, 205, 196, 0.4)';
            e.target.style.background = '#4ecdc4';
          }}>
            Join Now! 🎉
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
            Already a member? <a href="/login" style={{ 
              color: '#ff6b6b', 
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '15px'
            }}>Login →</a>
          </p>
        </div>
      </div>
    </div>
  );
}



