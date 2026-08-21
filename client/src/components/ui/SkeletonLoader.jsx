import React from 'react';

export const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`} />
);

export const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-6 w-1/3" />
      <SkeletonBox className="h-6 w-16 rounded-full" />
    </div>
    <SkeletonBox className="h-4 w-full" />
    <SkeletonBox className="h-4 w-5/6" />
    <div className="pt-4 flex gap-3">
      <SkeletonBox className="h-8 w-24 rounded-lg" />
      <SkeletonBox className="h-8 w-24 rounded-lg" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 4 }) => (
  <div className="space-y-3">
    <SkeletonBox className="h-10 w-full rounded-xl" />
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonBox key={i} className="h-12 w-full rounded-xl" />
    ))}
  </div>
);

export default SkeletonBox;
