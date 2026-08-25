import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, HeartPulse, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetUrl('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSent(true);
      if (res.data.resetUrl) setResetUrl(res.data.resetUrl);
      toast.success(res.data.message || 'Reset instructions sent.');
    } catch (err) {
      toast.error(err.message || 'Unable to start password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#0b5755] dark:bg-[#4aa497] items-center justify-center text-white dark:text-[#091617] shadow-card">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold font-serif-heading text-[#122b2e] dark:text-white">Reset your password</h2>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6]">
            Enter the email on your MediCare AI account. We will issue a time-limited reset link.
          </p>
        </div>

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
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Send reset link
            </Button>
          </form>

          {sent && (
            <div className="mt-4 rounded-2xl border border-[#c0e6d6] dark:border-[#1f5c49] bg-[#eaf5f0] dark:bg-[#13382c]/50 p-4 text-xs text-[#122b2e] dark:text-[#edf7f3]">
              <p>
                If that email is registered, a reset link was generated.
              </p>
              {resetUrl && (
                <Link
                  to={resetUrl.replace(window.location.origin, '')}
                  className="mt-2 inline-block font-semibold text-[#0b5755] dark:text-[#4aa497] underline break-all"
                >
                  Continue to reset password
                </Link>
              )}
            </div>
          )}

          <Link
            to="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[#6b8582] hover:text-[#0b5755] dark:text-[#7e9d97] dark:hover:text-[#4aa497]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
