import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Splash = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0: logo appear, 1: glow, 2: text, 3: exit

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),
      setTimeout(() => setPhase(2), 1400),
      setTimeout(() => setPhase(3), 2800),
      setTimeout(() => onComplete(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: '#02040A', zIndex: 99999 }}
    >
      {/* Background orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/[0.06] blur-[150px] animate-pulse-slow" />
      <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan-500/[0.04] blur-[100px] animate-float" />

      <AnimatePresence>
        {phase < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            {/* Logo SVG */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
              animate={{
                scale: phase >= 1 ? 1 : 0.3,
                opacity: phase >= 0 ? 1 : 0,
                rotate: 0,
                filter: phase >= 1 ? 'drop-shadow(0 0 60px rgba(59,130,246,0.6))' : 'none'
              }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <svg width="120" height="120" viewBox="0 0 60 60" fill="none">
                <defs>
                  <linearGradient id="splashGrad" x1="0" y1="0" x2="60" y2="60">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <path d="M30 3L54 17V43L30 57L6 43V17L30 3Z" stroke="url(#splashGrad)" strokeWidth="1.5" fill="rgba(59,130,246,0.06)" />
                <path d="M30 12L46 21V39L30 48L14 39V21L30 12Z" stroke="url(#splashGrad)" strokeWidth="0.8" fill="none" opacity="0.4" />
                <circle cx="30" cy="30" r="5" fill="url(#splashGrad)" />
                <circle cx="30" cy="14" r="2.5" fill="#3B82F6" opacity="0.8" />
                <circle cx="44" cy="22" r="2.5" fill="#06B6D4" opacity="0.7" />
                <circle cx="44" cy="38" r="2.5" fill="#8B5CF6" opacity="0.6" />
                <circle cx="30" cy="46" r="2.5" fill="#06B6D4" opacity="0.7" />
                <circle cx="16" cy="38" r="2.5" fill="#3B82F6" opacity="0.6" />
                <circle cx="16" cy="22" r="2.5" fill="#8B5CF6" opacity="0.8" />
                <line x1="30" y1="14" x2="30" y2="25" stroke="#3B82F6" strokeWidth="0.6" opacity="0.5" />
                <line x1="44" y1="22" x2="35" y2="28" stroke="#06B6D4" strokeWidth="0.6" opacity="0.4" />
                <line x1="16" y1="22" x2="25" y2="28" stroke="#8B5CF6" strokeWidth="0.6" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 20 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="text-center"
            >
              <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight">
                <span className="text-foreground">Tech</span>
                <span className="text-gradient">Tribe</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-3 text-sm md:text-base text-muted-foreground tracking-[0.15em] uppercase"
              >
                Ideyaları Koda Çeviririk
              </motion.p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              className="w-48 h-0.5 rounded-full bg-white/[0.06] overflow-hidden"
            >
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: phase >= 2 ? '100%' : '40%' }}
                transition={{ duration: phase >= 2 ? 1.2 : 0.6, ease: 'easeInOut' }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-cyan-400 to-violet-500"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Splash;
