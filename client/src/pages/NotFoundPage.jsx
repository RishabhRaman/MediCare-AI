import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] mx-auto flex items-center justify-center shadow-card">
          <HeartPulse className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
          404 - Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] leading-relaxed">
          The clinical page or document resource you requested could not be located.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="md" icon={Home}>
              Back to Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
