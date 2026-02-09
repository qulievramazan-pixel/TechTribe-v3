import React, { useState, useEffect, createContext, useContext } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import Products from './pages/Products';
import Splash from './pages/Splash';
import { Toaster } from './components/ui/sonner';
import { Sun, Moon } from 'lucide-react';

// Theme Context
export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      data-testid="theme-toggle"
      onClick={toggleTheme}
      className="fixed top-24 right-6 z-50 w-11 h-11 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] flex items-center justify-center transition-all duration-300 backdrop-blur-lg"
      title={theme === 'dark' ? 'Işıqlı rejim' : 'Qaranlıq rejim'}
    >
      {theme === 'dark' ? (
        <Sun className="w-4.5 h-4.5 text-amber-400" />
      ) : (
        <Moon className="w-4.5 h-4.5 text-blue-400" />
      )}
    </button>
  );
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
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
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('techtribe_splash_seen');
  });

  useEffect(() => {
    catalogueAPI.getAll().then(res => setCatalogue(res.data)).catch(() => {});
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('techtribe_token');
    localStorage.removeItem('techtribe_user');
    setUser(null);
  };

  const handleSplashDone = () => {
    sessionStorage.setItem('techtribe_splash_seen', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <Splash onComplete={handleSplashDone} />;
  }

  const isAdmin = location.pathname.startsWith('/tuqayyaxsi');
  const isAuth = location.pathname === '/eliyaxsi';
  const showNavbar = !isAdmin;
  const showFooter = !isAdmin && !isAuth;
  const showChat = !isAdmin && !isAuth;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {showNavbar && <Navbar />}
      {!isAdmin && <ThemeToggle />}
      <PageTransition>
        <Routes location={location}>
          <Route path="/" element={<Home catalogue={catalogue} />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:id" element={<CatalogueDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/eliyaxsi" element={<Auth onLogin={handleLogin} />} />
          <Route path="/tuqayyaxsi" element={
            user ? <Admin user={user} onLogout={handleLogout} /> : <Auth onLogin={handleLogin} />
          } />
          {/* Legacy routes redirect */}
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
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('techtribe_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('techtribe_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
