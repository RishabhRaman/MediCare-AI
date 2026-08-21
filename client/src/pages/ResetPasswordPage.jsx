import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Lock, HeartPulse } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { applySession } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      applySession(res.data.token, res.data.user);
      toast.success('Password updated. Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Choose a new password</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Use at least 6 characters. This signs you in immediately after a successful reset.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="New password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <Input
              label="Confirm password"
              type="password"
              icon={Lock}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={6}
              required
            />
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              Update password
            </Button>
          </form>
          <Link to="/login" className="mt-6 block text-center text-xs text-sky-500 underline">
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
