import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo, LogoOverlay } from './Logo';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Ana Səhifə', path: '/' },
  { label: 'Haqqımızda', path: '/about' },
  { label: 'Xidmətlər', path: '/products' },
  { label: 'Kataloq', path: '/catalogue' },
  { label: 'Əlaqə', path: '/contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [logoAnim, setLogoAnim] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogoClick = () => {
    if (location.pathname === '/') return;
    setLogoAnim(true);
    setShowOverlay(true);
  };

  const handleOverlayComplete = () => {
    setShowOverlay(false);
    setLogoAnim(false);
    navigate('/');
  };

  return (
    <>
      <LogoOverlay show={showOverlay} onComplete={handleOverlayComplete} />
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? 'py-0' : 'py-2'}`} data-testid="navbar">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
            {/* Logo */}
            <div className={logoAnim ? 'logo-click-anim' : ''}>
              <Logo onClick={handleLogoClick} />
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute inset-0 rounded-full bg-white/[0.06] border border-white/[0.08]"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
              <Link
                to="/eliyaxsi"
                data-testid="nav-admin-btn"
                className="ml-6 group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium bg-primary text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105"
              >
                <span className="relative z-10">Daxil ol</span>
                <ArrowUpRight className="w-3.5 h-3.5 relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <div className="shimmer-btn absolute inset-0" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button
              data-testid="mobile-menu-toggle"
              className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="md:hidden border-t border-white/5 overflow-hidden"
              style={{ background: 'rgba(2, 4, 10, 0.98)', backdropFilter: 'blur(40px)' }}
            >
              <div className="px-6 py-5 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'text-primary bg-primary/10 border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3.5 rounded-xl text-sm font-medium bg-primary text-white text-center mt-3"
                >
                  Daxil ol
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navbar background */}
        <div
          className="absolute inset-0 -z-10 transition-all duration-500"
          style={{
            background: scrolled ? 'rgba(2, 4, 10, 0.9)' : 'rgba(2, 4, 10, 0.5)',
            backdropFilter: scrolled ? 'blur(24px) saturate(1.5)' : 'blur(10px)',
            borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : 'none'
          }}
        />
      </nav>
    </>
  );
};

export default Navbar;
