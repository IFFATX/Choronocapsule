import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/notifications.css";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get("http://localhost:5001/api/notifications", config);
      setNotifications(res.data);

      const countRes = await axios.get("http://localhost:5001/api/notifications/unread-count", config);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    // Listen for badge earned events
    const handleBadgeEarned = () => {
      fetchNotifications();
    };
    window.addEventListener('badgeEarned', handleBadgeEarned);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('badgeEarned', handleBadgeEarned);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5001/api/notifications/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5001/api/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchNotifications();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button className="notification-bell" onClick={handleBellClick}>
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn" 
                onClick={handleMarkAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
                <span style={{ fontSize: "40px" }}>📭</span>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${!notif.isRead ? 'unread' : ''}`}
                >
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">
                      {formatTime(notif.createdAt)}
                    </span>
                  </div>
                  <div className="notification-actions">
                    {!notif.isRead && (
                      <button 
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notif._id)}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteNotification(notif._id)}
                      title="Delete"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
