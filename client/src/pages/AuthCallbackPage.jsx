import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthCallbackPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { applySession } = useAuth();

  useEffect(() => {
    const run = async () => {
      const token = params.get('token');
      if (!token) {
        toast.error('Google sign-in did not return a session.');
        navigate('/login');
        return;
      }
      try {
        localStorage.setItem('token', token);
        const res = await api.get('/auth/me');
        if (res.data.success) {
          applySession(token, res.data.user);
          toast.success(`Signed in as ${res.data.user.name}`);
          navigate('/dashboard');
        } else {
          throw new Error('Unable to load profile');
        }
      } catch (err) {
        toast.error(err.message || 'Google sign-in failed.');
        navigate('/login');
      }
    };
    run();
  }, [params, applySession, navigate]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 mx-auto border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Completing secure sign-in…</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
