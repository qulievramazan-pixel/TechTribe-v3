import React, { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { catalogueAPI } from './lib/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import About from './pages/About';
import Catalogue from './pages/Catalogue';
import CatalogueDetail from './pages/CatalogueDetail';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import { Toaster } from './components/ui/sonner';

const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('techtribe_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [catalogue, setCatalogue] = useState([]);

  useEffect(() => {
    catalogueAPI.getAll().then(res => setCatalogue(res.data)).catch(() => {});
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('techtribe_token');
    localStorage.removeItem('techtribe_user');
    setUser(null);
  };

  const isAdmin = location.pathname.startsWith('/admin');
  const isAuth = location.pathname === '/auth';
  const showNavbar = !isAdmin;
  const showFooter = !isAdmin && !isAuth;
  const showChat = !isAdmin && !isAuth;

  return (
    <div className="min-h-screen" style={{ background: '#02040A' }}>
      {showNavbar && <Navbar />}
      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<Home catalogue={catalogue} />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:id" element={<CatalogueDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/admin" element={
            user ? <Admin user={user} onLogout={handleLogout} /> : <Auth onLogin={handleLogin} />
          } />
        </Routes>
      </PageTransition>
      {showFooter && <Footer />}
      {showChat && <ChatWidget />}
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
