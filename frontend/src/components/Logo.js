import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Logo = ({ size = 'md', onClick, className = '' }) => {
  const sizes = { sm: 32, md: 40, lg: 56, xl: 80 };
  const s = sizes[size] || sizes.md;

  return (
    <div
      data-testid="techtribe-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      <svg width={s} height={s} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
        <defs>
          <linearGradient id="logoGrad1" x1="0" y1="0" x2="60" y2="60">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="logoFill" x1="0" y1="0" x2="60" y2="60">
            <stop offset="0%" stopColor="rgba(59,130,246,0.08)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.04)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Outer hexagon */}
        <path d="M30 3L54 17V43L30 57L6 43V17L30 3Z" stroke="url(#logoGrad1)" strokeWidth="1.2" fill="url(#logoFill)" />
        {/* Inner hexagon */}
        <path d="M30 12L46 21V39L30 48L14 39V21L30 12Z" stroke="url(#logoGrad1)" strokeWidth="0.8" fill="none" opacity="0.4" />
        {/* Center node */}
        <circle cx="30" cy="30" r="4" fill="url(#logoGrad1)" filter="url(#glow)" />
        {/* Outer nodes */}
        <circle cx="30" cy="14" r="2.5" fill="#3B82F6" opacity="0.8" />
        <circle cx="44" cy="22" r="2.5" fill="#06B6D4" opacity="0.7" />
        <circle cx="44" cy="38" r="2.5" fill="#8B5CF6" opacity="0.6" />
        <circle cx="30" cy="46" r="2.5" fill="#06B6D4" opacity="0.7" />
        <circle cx="16" cy="38" r="2.5" fill="#3B82F6" opacity="0.6" />
        <circle cx="16" cy="22" r="2.5" fill="#8B5CF6" opacity="0.8" />
        {/* Connection lines */}
        <line x1="30" y1="14" x2="30" y2="26" stroke="url(#logoGrad1)" strokeWidth="0.6" opacity="0.5" />
        <line x1="44" y1="22" x2="34" y2="28" stroke="url(#logoGrad1)" strokeWidth="0.6" opacity="0.4" />
        <line x1="44" y1="38" x2="34" y2="32" stroke="url(#logoGrad1)" strokeWidth="0.6" opacity="0.3" />
        <line x1="30" y1="46" x2="30" y2="34" stroke="url(#logoGrad1)" strokeWidth="0.6" opacity="0.4" />
        <line x1="16" y1="38" x2="26" y2="32" stroke="url(#logoGrad1)" strokeWidth="0.6" opacity="0.3" />
        <line x1="16" y1="22" x2="26" y2="28" stroke="url(#logoGrad1)" strokeWidth="0.6" opacity="0.5" />
        {/* Cross connections */}
        <line x1="30" y1="14" x2="44" y2="22" stroke="#3B82F6" strokeWidth="0.3" opacity="0.2" />
        <line x1="44" y1="22" x2="44" y2="38" stroke="#06B6D4" strokeWidth="0.3" opacity="0.2" />
        <line x1="16" y1="22" x2="16" y2="38" stroke="#8B5CF6" strokeWidth="0.3" opacity="0.2" />
      </svg>
      <div className="flex flex-col">
        <span className="font-heading font-bold text-foreground tracking-tight leading-none" style={{ fontSize: s * 0.48 }}>
          Tech<span className="text-gradient">Tribe</span>
        </span>
        {size === 'lg' || size === 'xl' ? (
          <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mt-0.5">Digital Solutions</span>
        ) : null}
      </div>
    </div>
  );
};

// Logo Overlay Component for cinematic transition
export const LogoOverlay = ({ show, onComplete }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={() => {
            setTimeout(onComplete, 900);
          }}
          className="logo-overlay"
        >
          <div className="logo-overlay-anim">
            <svg width="120" height="120" viewBox="0 0 60 60" fill="none">
              <defs>
                <linearGradient id="overlayGrad" x1="0" y1="0" x2="60" y2="60">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <path d="M30 3L54 17V43L30 57L6 43V17L30 3Z" stroke="url(#overlayGrad)" strokeWidth="2" fill="rgba(59,130,246,0.1)" />
              <circle cx="30" cy="30" r="6" fill="url(#overlayGrad)" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Logo;
