import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/badges.css";

export default function BadgeDisplay() {
  const [myBadges, setMyBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [myBadgesRes, allBadgesRes] = await Promise.all([
        axios.get("http://localhost:5001/api/badges/my-badges", config),
        axios.get("http://localhost:5001/api/badges/all-badges", config)
      ]);

      console.log("My badges:", myBadgesRes.data);
      console.log("All badges:", allBadgesRes.data);

      setMyBadges(myBadgesRes.data);
      setAllBadges(allBadgesRes.data);
    } catch (err) {
      console.error("Error fetching badges:", err);
    }
  };

  const checkForNewBadges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5001/api/badges/check-badges",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Badge check response:", res.data);

      if (res.data.newBadges && res.data.newBadges.length > 0) {
        // Show popup for first new badge
        setNewBadge(res.data.newBadges[0]);
        setShowPopup(true);
        
        // Refresh badges
        await fetchBadges();
        
        // Trigger notification refresh by dispatching a custom event
        window.dispatchEvent(new Event('badgeEarned'));
        
        // Hide popup after 4 seconds
        setTimeout(() => setShowPopup(false), 4000);
        
        alert(`🎉 You earned ${res.data.newBadges.length} new badge(s)! Check your notifications!`);
      } else {
        alert("No new badges earned yet. Keep creating capsules! 📦");
      }
    } catch (err) {
      console.error("Error checking badges:", err);
      alert("Error checking badges. Please try again.");
    }
  };

  const myBadgeIds = myBadges.map(b => b.id);

  return (
    <div className="badge-container">
      <div className="badge-header">
        <h3>🏆 Your Achievements</h3>
        <button className="check-badges-btn" onClick={checkForNewBadges}>
          Check for New Badges
        </button>
      </div>

      <div className="badge-grid">
        {allBadges.map((badge) => {
          const earned = myBadgeIds.includes(badge.id);
          return (
            <div 
              key={badge.id} 
              className={`badge-card ${earned ? 'earned' : 'locked'}`}
              title={badge.requirement}
            >
              <div className="badge-icon">{badge.icon}</div>
              <div className="badge-info">
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
                {!earned && <span className="badge-requirement">{badge.requirement}</span>}
              </div>
              {earned && <div className="badge-checkmark">✓</div>}
              {!earned && <div className="badge-lock">🔒</div>}
            </div>
          );
        })}
      </div>

      {/* Badge Unlock Popup */}
      {showPopup && newBadge && (
        <div className="badge-popup">
          <div className="badge-popup-content">
            <div className="badge-popup-icon">{newBadge.icon}</div>
            <h2>🎉 Achievement Unlocked!</h2>
            <h3>{newBadge.name}</h3>
            <p>{newBadge.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
