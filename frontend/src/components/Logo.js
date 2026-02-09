import React from 'react';

export const Logo = ({ size = 'md', onClick, className = '' }) => {
  const sizes = { sm: 32, md: 40, lg: 56 };
  const s = sizes[size] || sizes.md;

  return (
    <div
      data-testid="techtribe-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
    >
      <svg width={s} height={s} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
        {/* Hexagonal frame */}
        <path d="M24 3L43 14V34L24 45L5 34V14L24 3Z" stroke="url(#logoGrad)" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M24 8L38 16.5V31.5L24 40L10 31.5V16.5L24 8Z" stroke="url(#logoGrad)" strokeWidth="1" fill="rgba(59,130,246,0.05)" />
        {/* Inner tech nodes */}
        <circle cx="24" cy="14" r="2" fill="#3B82F6" />
        <circle cx="15" cy="28" r="2" fill="#3B82F6" opacity="0.7" />
        <circle cx="33" cy="28" r="2" fill="#3B82F6" opacity="0.7" />
        <circle cx="24" cy="24" r="3" fill="#3B82F6" />
        {/* Connection lines */}
        <line x1="24" y1="14" x2="24" y2="24" stroke="#3B82F6" strokeWidth="0.8" opacity="0.5" />
        <line x1="15" y1="28" x2="24" y2="24" stroke="#3B82F6" strokeWidth="0.8" opacity="0.5" />
        <line x1="33" y1="28" x2="24" y2="24" stroke="#3B82F6" strokeWidth="0.8" opacity="0.5" />
      </svg>
      <span className="font-heading font-bold text-foreground tracking-tight" style={{ fontSize: s * 0.5 }}>
        Tech<span className="text-primary">Tribe</span>
      </span>
    </div>
  );
};

export default Logo;
