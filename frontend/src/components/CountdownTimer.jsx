import { useState, useEffect } from "react";

export default function CountdownTimer({ releaseDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReleased: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(releaseDate).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isReleased: true,
        });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isReleased: false,
        });
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [releaseDate]);

  if (timeLeft.isReleased) {
    return (
      <div className="countdown-container released">
        <h3>🎉 Ready to Open!</h3>
        <p>This capsule has been unlocked</p>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      <div className="countdown-box">
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeLeft.hours).padStart(2, "0")}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeLeft.minutes).padStart(2, "0")}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeLeft.seconds).padStart(2, "0")}</span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  );
}
