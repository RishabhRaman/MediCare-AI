import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, Calendar } from 'lucide-react';
import Badge from '../ui/Badge';

const RecentReportsWidget = ({ reports = [] }) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#0b5755] dark:text-[#4aa497]" />
          <h3 className="text-lg font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Recent Medical Reports
          </h3>
        </div>
        <Link
          to="/reports/history"
          className="text-xs text-[#0b5755] dark:text-[#4aa497] hover:underline font-semibold flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-6 text-[#6b8582] dark:text-[#7e9d97] text-xs">
          <p>No reports analyzed yet.</p>
          <Link
            to="/reports/analyze"
            className="mt-2 inline-block text-[#0b5755] dark:text-[#4aa497] hover:underline font-semibold"
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
                className="block p-3.5 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] hover:border-[#b8ded5] transition-all group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#122b2e] dark:text-white group-hover:text-[#0b5755] dark:group-hover:text-[#4aa497] truncate transition-colors">
                      {rep.title}
                    </p>
                    <p className="text-[10px] text-[#6b8582] dark:text-[#7e9d97] flex items-center gap-1 mt-0.5">
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
