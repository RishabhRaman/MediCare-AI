import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse,
  Sun,
  Moon,
  LogOut,
  User,
  ShieldCheck,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'interactive-suite', label: 'Interactive Tools' },
  { id: 'safety', label: 'Our Approach' },
  { id: 'faq', label: 'FAQ' },
];

const Navbar = ({ onEmergencyTrigger }) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDemoClick = async () => {
    const res = await demoLogin();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleSectionNavigation = (sectionId) => {
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate(`/?section=${sectionId}`);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'glass-nav shadow-subtle'
          : 'bg-[#fbfcfa]/95 dark:bg-[#091617]/95 backdrop-blur-md border-b border-[#e2ebe7]/80 dark:border-[#1c4246]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo with animated hover */}
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <motion.div
              whileHover={{ scale: 1.06, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-[#0b5755] dark:bg-[#4aa497] flex items-center justify-center text-white dark:text-[#091617] shadow-subtle transition-transform"
            >
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold font-serif-heading tracking-tight text-[#122b2e] dark:text-white">
                  MediCare
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#dcefe9] text-[#0b5755] dark:bg-[#173b3f] dark:text-[#83c4b8] border border-[#b8ded5] dark:border-[#2c5f64]">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#6b8582] dark:text-[#7e9d97] font-medium leading-none tracking-tight">
                Clinical Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Center Navigation with animated pill indicator */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-[#425b59] dark:text-[#b4cbc6] bg-[#f3f7f5]/80 dark:bg-[#102629]/80 p-1.5 rounded-2xl border border-[#e2ebe7] dark:border-[#1c4246]">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSectionNavigation(link.id)}
                  onMouseEnter={() => setActiveHover(link.id)}
                  onMouseLeave={() => setActiveHover(null)}
                  className="relative px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer hover:text-[#0b5755] dark:hover:text-[#4aa497]"
                >
                  {activeHover === link.id && (
                    <motion.div
                      layoutId="navHoverPill"
                      className="absolute inset-0 bg-white dark:bg-[#143236] rounded-xl shadow-subtle -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
                    />
                  )}
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right Action Icons & Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Emergency SOS Trigger */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onEmergencyTrigger && onEmergencyTrigger('Manual SOS check / Acute red-flag medical alert.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#fef2f2] dark:bg-[#451010] text-[#991b1b] dark:text-[#fca5a5] border border-[#fecaca] dark:border-[#7f1d1d] hover:bg-[#b91c1c] hover:text-white dark:hover:bg-[#b91c1c] dark:hover:text-white transition-all cursor-pointer"
              title="Emergency SOS Quick Action"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS Alert</span>
            </motion.button>

            {/* Theme Toggle with Rotation Animation */}
            <motion.button
              whileTap={{ rotate: 180, scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#425b59] hover:text-[#122b2e] dark:text-[#b4cbc6] dark:hover:text-white hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors border border-transparent hover:border-[#d6e4df] dark:hover:border-[#1c4246] cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#122b2e]" />
              )}
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-[#e2ebe7] dark:border-[#1c4246]">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors border border-transparent hover:border-[#d6e4df] dark:hover:border-[#1c4246]"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#dcefe9] border border-[#b8ded5] text-[#0b5755] dark:bg-[#173b3f] dark:border-[#2c5f64] dark:text-[#83c4b8] flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-[#122b2e] dark:text-[#edf7f3] leading-tight">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-[#6b8582] dark:text-[#7e9d97]">
                      {user?.isDemoUser ? 'Demo Patient' : 'Patient Portal'}
                    </p>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  icon={LogOut}
                  title="Sign Out"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDemoClick}
                    icon={Sparkles}
                    className="text-xs text-[#0b5755] dark:text-[#4aa497] bg-[#dcefe9]/60 dark:bg-[#173b3f]/60 border border-[#b8ded5] dark:border-[#2c5f64] hover:bg-[#dcefe9] dark:hover:bg-[#173b3f]"
                  >
                    Demo Tour
                  </Button>
                </motion.div>
                <Link to="/login">
                  <Button variant="secondary" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#425b59] dark:text-[#b4cbc6]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#122b2e] dark:text-[#edf7f3] hover:bg-[#f3f7f5] dark:hover:bg-[#143236] cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Slide-down Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="sm:hidden border-t border-[#e2ebe7] dark:border-[#1c4246] bg-white/98 dark:bg-[#091617]/98 backdrop-blur-2xl px-5 py-6 space-y-4 shadow-elevation overflow-hidden"
          >
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 pb-4 border-b border-[#e2ebe7] dark:border-[#1c4246]">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleSectionNavigation(link.id)}
                    className="text-left py-2 text-sm font-semibold text-[#122b2e] dark:text-[#edf7f3] hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}

            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-[#e2ebe7] dark:border-[#1c4246]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center font-bold text-sm">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#122b2e] dark:text-white">{user?.name}</p>
                      <p className="text-xs text-[#6b8582]">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout} icon={LogOut}>
                    Sign Out
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/reports/analyze" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">
                      Analyze Report
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDemoClick}
                  icon={Sparkles}
                  className="w-full justify-center"
                >
                  Try 1-Click Demo Tour
                </Button>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" size="md" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="md" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Emergency trigger inside mobile drawer */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onEmergencyTrigger && onEmergencyTrigger('Manual mobile SOS check');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-[#fef2f2] dark:bg-[#451010] text-[#991b1b] dark:text-[#fca5a5] border border-[#fecaca] dark:border-[#7f1d1d] cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Emergency SOS Protocol</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
