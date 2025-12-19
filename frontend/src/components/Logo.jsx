import React from 'react';

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', marginRight: '10px', verticalAlign: 'middle' }}
    >
      
      <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#333" strokeWidth="3" />

      
      <circle cx="50" cy="12" r="3" fill="#333" />
      <circle cx="88" cy="50" r="3" fill="#333" />
      <circle cx="50" cy="88" r="3" fill="#333" />
      <circle cx="12" cy="50" r="3" fill="#333" />

     
      <line x1="50" y1="50" x2="50" y2="28" stroke="#333" strokeWidth="3" strokeLinecap="round" />

      
      <line x1="50" y1="50" x2="68" y2="50" stroke="#ff4444" strokeWidth="2.5" strokeLinecap="round" />

      
      <circle cx="50" cy="50" r="5" fill="#333" />
    </svg>
  );
}

