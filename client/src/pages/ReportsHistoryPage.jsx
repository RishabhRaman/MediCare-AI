import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderClock,
  Search,
  FileText,
  Trash2,
  FileDown,
  ArrowRight,
  Plus,
  Calendar,
  Layers,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { generateMedicalReportPDF } from '../utils/pdfGenerator';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SkeletonTable } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const ReportsHistoryPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports', {
        params: { search, type: typeFilter, risk: riskFilter },
      });
      if (res.data.success) {
        setReports(res.data.reports);
      }
    } catch (err) {
      toast.error('Failed to load reports history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [search, typeFilter, riskFilter]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(reports.filter((r) => r._id !== id));
      toast.success('Report deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete report.');
    }
  };

  const handleDownload = (report) => {
    generateMedicalReportPDF(report, user);
    toast.success('Downloaded summary PDF.');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b5755] dark:text-[#4aa497]">
            Diagnostic Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Medical Reports History
          </h1>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-0.5">
            Search, review, and export all previous diagnostic evaluations.
          </p>
        </div>

        <Link to="/reports/analyze">
          <Button variant="primary" size="md" icon={Plus}>
            Analyze New Report
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b8582]" />
          <input
            type="text"
            placeholder="Search report titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-white dark:bg-[#0c1e20] text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
          />
        </div>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-white dark:bg-[#0c1e20] text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
        >
          <option value="all">All Report Categories</option>
          <option value="lipid_panel">Lipid Profile</option>
          <option value="blood_test">Complete Blood Count (CBC)</option>
          <option value="metabolic_panel">Metabolic Panel (CMP)</option>
          <option value="general_lab">General Lab</option>
          <option value="prescription">Prescription Summary</option>
        </select>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-white dark:bg-[#0c1e20] text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
        >
          <option value="all">All Risk Levels</option>
          <option value="normal">Normal</option>
          <option value="borderline">Borderline</option>
          <option value="elevated">Elevated</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Reports List */}
      {loading ? (
        <SkeletonTable rows={4} />
      ) : reports.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-[#6b8582] dark:text-[#7e9d97] space-y-3 shadow-card">
          <FolderClock className="w-12 h-12 text-[#6b8582] mx-auto" />
          <h3 className="text-base font-bold font-serif-heading text-[#122b2e] dark:text-white">
            No medical reports match your filter
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Upload your PDF or image reports to start building your personal diagnostic timeline.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const risk = report.aiAnalysis?.riskLevel || 'normal';
            return (
              <div
                key={report._id}
                className="glass-card rounded-3xl p-6 shadow-card hover:border-[#b8ded5] transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
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
                      dot
                    >
                      {risk.toUpperCase()} RISK
                    </Badge>
                    <span className="text-[11px] text-[#6b8582] dark:text-[#7e9d97] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.dateOfReport || report.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-serif-heading text-[#122b2e] dark:text-white line-clamp-1">
                    {report.title}
                  </h3>

                  <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] line-clamp-2 leading-relaxed">
                    {report.aiAnalysis?.executiveSummary || 'No executive summary.'}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-[#6b8582] dark:text-[#7e9d97]">
                    <Layers className="w-3.5 h-3.5 text-[#0b5755] dark:text-[#4aa497]" />
                    <span>
                      {report.aiAnalysis?.extractedParameters?.length || 0} biomarkers extracted
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e2ebe7] dark:border-[#1c4246] flex items-center justify-between">
                  <Link to={`/reports/analyze?id=${report._id}`}>
                    <Button variant="primary" size="sm" icon={ArrowRight}>
                      View Summary
                    </Button>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDownload(report)}
                      className="p-2 rounded-xl text-[#6b8582] hover:text-[#0b5755] dark:hover:text-[#4aa497] hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors"
                      title="Download PDF"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(report._id, report.title)}
                      className="p-2 rounded-xl text-[#6b8582] hover:text-red-500 hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportsHistoryPage;
