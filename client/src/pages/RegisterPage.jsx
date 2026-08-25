import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, HeartPulse, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    bloodType: '',
  });
  const [loading, setLoading] = useState(false);
  const { register, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const healthProfile = {
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender,
      bloodType: formData.bloodType,
    };

    const res = await register(formData.name, formData.email, formData.password, healthProfile);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-[#0b5755] dark:bg-[#4aa497] items-center justify-center text-white dark:text-[#091617] shadow-card">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Create Your Health Account
          </h2>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6]">
            Join MediCare AI to analyze reports and track your wellness trajectory.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Alex Mercer"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password (min. 6 characters)"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
                  Age (Yrs)
                </label>
                <input
                  type="number"
                  name="age"
                  placeholder="35"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
                  Blood Group
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
                >
                  <option value="" disabled>Select</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full text-sm py-3 mt-4"
            >
              Create Medical Account
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

          <GoogleAuthButton label="Sign up with Google" />

          <div className="mt-6 text-center text-xs text-[#6b8582] dark:text-[#7e9d97]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0b5755] dark:text-[#4aa497] font-semibold underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
