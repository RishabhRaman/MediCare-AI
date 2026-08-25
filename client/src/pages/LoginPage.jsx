import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Sparkles, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleDemoClick = async () => {
    setDemoLoading(true);
    const res = await demoLogin();
    setDemoLoading(false);

    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#0b5755] dark:bg-[#4aa497] items-center justify-center text-white dark:text-[#091617] shadow-card">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Welcome to MediCare AI
          </h2>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6]">
            Sign in to access your personal medical dashboard & report analysis.
          </p>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="glass-card rounded-2xl p-4 border border-[#b8ded5] dark:border-[#2c5f64] bg-[#dcefe9]/40 dark:bg-[#173b3f]/40 shadow-subtle">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0b5755] dark:text-[#4aa497] shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-[#122b2e] dark:text-white">
                  Want an instant portfolio tour?
                </p>
                <p className="text-[10px] text-[#6b8582] dark:text-[#7e9d97]">
                  Instant sign-in preloaded with clinical lab data.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={handleDemoClick}
              loading={demoLoading}
              icon={Sparkles}
              className="text-xs shrink-0"
            >
              Demo Tour
            </Button>
          </div>
        </div>

        {/* Login Form */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs font-semibold text-[#0b5755] dark:text-[#4aa497] hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full text-sm py-3 mt-2"
            >
              Sign In to Patient Portal
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e2ebe7] dark:border-[#1c4246]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
              <span className="bg-white dark:bg-[#102629] px-2 text-[#6b8582] dark:text-[#7e9d97]">or</span>
            </div>
          </div>

          <GoogleAuthButton label="Continue with Google" />

          <div className="mt-6 text-center text-xs text-[#6b8582] dark:text-[#7e9d97]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#0b5755] dark:text-[#4aa497] font-semibold underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
