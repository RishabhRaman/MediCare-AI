import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';

const Navbar = ({ onEmergencyTrigger }) => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo Brand */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#173b3f] flex items-center justify-center group-hover:bg-[#0f6b68] transition-colors duration-200">
              <div className="w-7 h-7 border border-[#83c4b8] rounded-full flex items-center justify-center">
                <HeartPulse className="w-4 h-4 text-[#dcefe9]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-[#173b3f] dark:text-white">
                  MediCare
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#dcefe9] text-[#0b5755] border border-[#b8ded5]">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                Clinical Intelligence
              </p>
            </div>
          </Link>

          {/* Desktop Center Navigation (When not authenticated or quick links) */}
          {!isAuthenticated ? (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
              <button
                type="button"
                onClick={() => handleSectionNavigation('features')}
                className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                Services
              </button>
              <button
                type="button"
                onClick={() => handleSectionNavigation('how-it-works')}
                className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => handleSectionNavigation('safety')}
                className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                Our approach
              </button>
              <button
                type="button"
                onClick={() => handleSectionNavigation('faq')}
                className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                Resources
              </button>
            </nav>
          ) : null}

          {/* Right Action Icons & Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Emergency SOS Trigger */}
            <button
              onClick={() => onEmergencyTrigger && onEmergencyTrigger('Manual SOS check / high-risk symptoms alert.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#fff2ef] text-[#a9423b] border border-[#e8b9b2] hover:bg-[#c4534a] hover:text-white transition-colors"
              title="Emergency SOS Quick Action"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS Alert</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-slate-200/50 dark:border-slate-800"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#dcefe9] border border-[#b8ded5] text-[#0b5755] flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {user?.isDemoUser ? 'Demo Patient' : 'Patient'}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDemoClick}
                  icon={Sparkles}
                  className="text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20"
                >
                  Demo Login
                </Button>
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

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
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
            <div className="space-y-2">
              <Button variant="primary" size="md" onClick={handleDemoClick} icon={Sparkles} className="w-full">
                Try 1-Click Demo
              </Button>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                <Button variant="outline" size="md" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
