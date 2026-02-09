import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Ana Səhifə', path: '/' },
  { label: 'Haqqımızda', path: '/about' },
  { label: 'Kataloq', path: '/catalogue' },
  { label: 'Əlaqə', path: '/contact' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [logoAnim, setLogoAnim] = useState(false);

  const handleLogoClick = () => {
    setLogoAnim(true);
    setTimeout(() => {
      setLogoAnim(false);
      navigate('/');
    }, 600);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40" data-testid="navbar">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className={logoAnim ? 'logo-click-anim' : ''}>
            <Logo onClick={handleLogoClick} />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-link-${link.path.replace('/', '') || 'home'}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/auth"
              data-testid="nav-admin-btn"
              className="ml-4 px-6 py-2.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-105"
            >
              Daxil ol
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/5"
            style={{ background: 'rgba(2, 4, 10, 0.98)', backdropFilter: 'blur(24px)' }}
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Daxil ol
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blur backdrop */}
      <div className="absolute inset-0 -z-10" style={{ background: 'rgba(2, 4, 10, 0.8)', backdropFilter: 'blur(16px)' }} />
    </nav>
  );
};

export default Navbar;
