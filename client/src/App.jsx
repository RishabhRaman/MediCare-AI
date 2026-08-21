import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import DisclaimerBanner from './components/layout/DisclaimerBanner';
import EmergencyModal from './components/layout/EmergencyModal';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import DashboardPage from './pages/DashboardPage';
import ReportAnalyzerPage from './pages/ReportAnalyzerPage';
import SymptomSearchPage from './pages/SymptomSearchPage';
import ReportsHistoryPage from './pages/ReportsHistoryPage';
import RecommendationsPage from './pages/RecommendationsPage';
import MetricsPage from './pages/MetricsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import FloatingAiBot from './components/chat/FloatingAiBot';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [emergencyReason, setEmergencyReason] = useState('');

  const handleTriggerEmergency = (reason) => {
    setEmergencyReason(reason || 'High-risk medical emergency indicators detected.');
    setEmergencyOpen(true);
  };

  const isAuthOrLanding =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password' ||
    location.pathname.startsWith('/reset-password') ||
    location.pathname.startsWith('/auth/callback');

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8f7] text-[#173b3f] dark:bg-[#0d2527] dark:text-slate-100 transition-colors duration-200">
      {/* Permanent Safety Notice Banner */}
      <DisclaimerBanner />

      {/* Global Navigation Bar */}
      <Navbar onEmergencyTrigger={handleTriggerEmergency} />

      {/* Main Body Section */}
      <div className="flex-1 flex w-full">
        {/* Sidebar (Rendered on Authenticated Patient Portal pages) */}
        {isAuthenticated && !isAuthOrLanding && <Sidebar />}

        {/* Dynamic Page Routes */}
        <main className={`flex-1 ${!isAuthOrLanding ? 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
          <Routes location={location}>
            <Route path="/" element={<LandingPage onEmergencyTrigger={handleTriggerEmergency} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected Portal Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/analyze"
              element={
                <ProtectedRoute>
                  <ReportAnalyzerPage onEmergencyTrigger={handleTriggerEmergency} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/symptoms/search"
              element={
                <ProtectedRoute>
                  <SymptomSearchPage onEmergencyTrigger={handleTriggerEmergency} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/history"
              element={
                <ProtectedRoute>
                  <ReportsHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <RecommendationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/metrics"
              element={
                <ProtectedRoute>
                  <MetricsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Floating 24/7 AI Medical Assistant Widget */}
      <FloatingAiBot onEmergencyTrigger={handleTriggerEmergency} />

      {/* Emergency Alert Modal */}
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        triggerReason={emergencyReason}
      />

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-card text-xs sm:text-sm font-medium',
          duration: 3500,
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(14, 165, 233, 0.3)',
            borderRadius: '16px',
          },
        }}
      />
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
