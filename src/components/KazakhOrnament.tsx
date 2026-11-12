import React from 'react';

// Elegant Gold Gradient Definitions
export const SvgGoldGradients: React.FC = () => (
  <svg width="0" height="0" className="absolute">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fdf3a9" />
        <stop offset="30%" stopColor="#d4af37" />
        <stop offset="70%" stopColor="#aa7c11" />
        <stop offset="100%" stopColor="#f6e27a" />
      </linearGradient>
      <linearGradient id="goldHori" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
        <stop offset="20%" stopColor="#d4af37" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#fff3ad" stopOpacity="1" />
        <stop offset="80%" stopColor="#d4af37" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="goldRadial" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fff7c2" />
        <stop offset="50%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#875c13" />
      </radialGradient>
    </defs>
  </svg>
);

// Traditional Kazakh Koshkar Muyiz Medallion
export const KazakhMedallion: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block ${className}`}
  >
    {/* Outer circle ring */}
    <circle cx="50" cy="50" r="46" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="50" cy="50" r="42" stroke="url(#goldGrad)" strokeWidth="1.2" />

    {/* Center 8-pointed star / Shanyraq floral motive */}
    <path
      d="M50 15 C52 28, 55 35, 68 35 C55 38, 52 45, 50 58 C48 45, 45 38, 32 35 C45 35, 48 28, 50 15 Z"
      fill="url(#goldGrad)"
      opacity="0.85"
    />
    <path
      d="M50 85 C52 72, 55 65, 68 65 C55 62, 52 55, 50 42 C48 55, 45 62, 32 65 C45 65, 48 72, 50 85 Z"
      fill="url(#goldGrad)"
      opacity="0.85"
    />
    <path
      d="M15 50 C28 52, 35 55, 35 68 C38 55, 45 52, 58 50 C45 48, 38 45, 35 32 C35 45, 28 48, 15 50 Z"
      fill="url(#goldGrad)"
      opacity="0.85"
    />
    <path
      d="M85 50 C72 52, 65 55, 65 68 C62 55, 55 52, 42 50 C55 48, 62 45, 65 32 C65 45, 72 48, 85 50 Z"
      fill="url(#goldGrad)"
      opacity="0.85"
    />

    {/* Central gem */}
    <circle cx="50" cy="50" r="6" fill="#440c19" stroke="url(#goldGrad)" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="2.5" fill="#fdf3a9" />
  </svg>
);

// Horizontal Ornamental Divider with Kazakh Ram Horn curls
export const KazakhDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center my-6 space-x-3 ${className}`}>
    <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-[#d4af37]" />
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" className="shrink-0 text-[#d4af37]">
      {/* Central diamond */}
      <polygon points="30,4 36,12 30,20 24,12" fill="url(#goldGrad)" />
      {/* Left horn curl */}
      <path
        d="M24 12 C18 12, 12 6, 8 8 C5 9.5, 4 13, 8 14 C12 15, 16 11, 20 12"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right horn curl */}
      <path
        d="M36 12 C42 12, 48 6, 52 8 C55 9.5, 56 13, 52 14 C48 15, 44 11, 40 12"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
    <div className="h-[1px] flex-1 max-w-[120px] bg-gradient-to-l from-transparent via-[#d4af37]/60 to-[#d4af37]" />
  </div>
);

// Luxury Ornamental Corner
export const KazakhCorner: React.FC<{
  position: 'tl' | 'tr' | 'bl' | 'br';
  className?: string;
  size?: number;
}> = ({ position, className = '', size = 52 }) => {
  const getTransform = () => {
    switch (position) {
      case 'tr': return 'scaleX(-1)';
      case 'bl': return 'scaleY(-1)';
      case 'br': return 'scale(-1, -1)';
      default: return 'none';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      fill="none"
      style={{ transform: getTransform() }}
      className={`absolute pointer-events-none opacity-80 ${className}`}
    >
      <path
        d="M3 49 V16 C3 8.8 8.8 3 16 3 H49"
        stroke="url(#goldGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8 45 V18 C8 12.5 12.5 8 18 8 H45"
        stroke="url(#goldGrad)"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        opacity="0.7"
      />
      {/* Corner filigree spiral */}
      <path
        d="M16 16 C16 12, 20 10, 23 13 C26 16, 22 22, 17 22 C11 22, 10 14, 15 10"
        stroke="url(#goldGrad)"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="28" cy="7" r="1.5" fill="#fdf3a9" />
      <circle cx="7" cy="28" r="1.5" fill="#fdf3a9" />
    </svg>
  );
};
