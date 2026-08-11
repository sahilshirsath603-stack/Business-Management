import React from 'react';

export const BlenLogo = ({ size = 40, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 10px rgba(0, 242, 254, 0.3))' }}
    >
      <defs>
        {/* Loop 1: Cyan / Electric Blue */}
        <linearGradient id="blen-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="100%" stopColor="#00C6FF" />
        </linearGradient>

        {/* Loop 2: Emerald Green */}
        <linearGradient id="blen-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E676" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Loop 3: Golden Yellow / Olive */}
        <linearGradient id="blen-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Loop 4: Crimson Red */}
        <linearGradient id="blen-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>

        {/* Loop 5: Neon Orange */}
        <linearGradient id="blen-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B00" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>

        {/* Loop 6: Lime Olive */}
        <linearGradient id="blen-lime" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#65A30D" />
        </linearGradient>
      </defs>

      {/* 6 Overlapping Infinite Ribbon Petals */}
      <g strokeWidth="16" strokeLinecap="round" fill="none">
        {/* Top Right Cyan Loop */}
        <path
          d="M 100 100 C 120 60, 160 50, 165 80 C 170 110, 130 120, 100 100"
          stroke="url(#blen-cyan)"
        />
        {/* Mid Right Emerald Loop */}
        <path
          d="M 100 100 C 140 80, 180 110, 160 135 C 140 160, 110 130, 100 100"
          stroke="url(#blen-green)"
        />
        {/* Bottom Right Lime Loop */}
        <path
          d="M 100 100 C 130 130, 140 175, 115 175 C 90 175, 80 135, 100 100"
          stroke="url(#blen-lime)"
        />
        {/* Bottom Left Crimson Red Loop */}
        <path
          d="M 100 100 C 80 140, 40 170, 35 140 C 30 110, 70 100, 100 100"
          stroke="url(#blen-red)"
        />
        {/* Mid Left Neon Orange Loop */}
        <path
          d="M 100 100 C 60 120, 20 90, 40 65 C 60 40, 90 70, 100 100"
          stroke="url(#blen-orange)"
        />
        {/* Top Left Golden Yellow Loop */}
        <path
          d="M 100 100 C 70 70, 60 25, 85 25 C 110 25, 120 65, 100 100"
          stroke="url(#blen-yellow)"
        />
      </g>

      {/* Central Infinity Knot Intersection Accents */}
      <circle cx="100" cy="100" r="8" fill="#00F2FE" opacity="0.6" />
    </svg>
  );
};
