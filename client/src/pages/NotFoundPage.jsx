import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-400 mx-auto flex items-center justify-center border border-sky-500/20 shadow-glow">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">
          404 - Page Not Found
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          The clinical page or document resource you requested could not be located.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
