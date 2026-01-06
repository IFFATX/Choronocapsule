import React from 'react';

export default function Logo({ size = 60 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', marginRight: '12px', verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd93d" />
          <stop offset="100%" stopColor="#ffc107" />
        </linearGradient>
      </defs>

      {/* Outer ring */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#ffd93d" strokeWidth="6" />

      {/* Main clock circle */}
      <circle cx="50" cy="50" r="38" fill="white" stroke="#4ecdc4" strokeWidth="4" />

      {/* Hour markers */}
      <circle cx="50" cy="18" r="3" fill="#ff6b6b" />
      <circle cx="82" cy="50" r="3" fill="#ff6b6b" />
      <circle cx="50" cy="82" r="3" fill="#ff6b6b" />
      <circle cx="18" cy="50" r="3" fill="#ff6b6b" />

      {/* Clock hands */}
      <line x1="50" y1="50" x2="50" y2="30" stroke="#4ecdc4" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="50" x2="65" y2="50" stroke="#ff8e53" strokeWidth="3.5" strokeLinecap="round" />

      {/* Center dot */}
      <circle cx="50" cy="50" r="5" fill="#ffd93d" />
    </svg>
  );
}

