import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Sparkles, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';

const RecentReportsWidget = ({ reports = [] }) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Medical Reports
          </h3>
        </div>
        <Link
          to="/reports/history"
          className="text-xs text-sky-500 hover:text-sky-400 font-semibold flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
          <p>No reports analyzed yet.</p>
          <Link
            to="/reports/analyze"
            className="mt-2 inline-block text-sky-500 hover:underline font-semibold"
          >
            + Upload your first lab report
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.slice(0, 3).map((rep) => {
            const risk = rep.aiAnalysis?.riskLevel || 'normal';
            return (
              <Link
                key={rep._id}
                to={`/reports/analyze?id=${rep._id}`}
                className="block p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500 truncate transition-colors">
                      {rep.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(rep.dateOfReport || rep.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge
                    variant={
                      risk === 'critical'
                        ? 'critical'
                        : risk === 'elevated'
                        ? 'elevated'
                        : risk === 'borderline'
                        ? 'borderline'
                        : 'normal'
                    }
                    size="sm"
                  >
                    {risk.toUpperCase()}
                  </Badge>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentReportsWidget;
