import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileSearch,
  Stethoscope,
  Activity,
  CheckSquare,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import HealthScoreCard from '../components/dashboard/HealthScoreCard';
import MetricsChart from '../components/dashboard/MetricsChart';
import UpcomingTasksWidget from '../components/dashboard/UpcomingTasksWidget';
import RecentReportsWidget from '../components/dashboard/RecentReportsWidget';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { SkeletonCard } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [metricsGrouped, setMetricsGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  // Log Metric Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logFormData, setLogFormData] = useState({
    metricType: 'blood_glucose',
    value: '',
    secondaryValue: '',
    unit: 'mg/dL',
    notes: '',
  });
  const [isLogging, setIsLogging] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, metricsRes] = await Promise.all([
        api.get('/metrics/dashboard-summary'),
        api.get('/metrics'),
      ]);

      if (summaryRes.data.success) {
        setSummary(summaryRes.data.summary);
      }
      if (metricsRes.data.success) {
        setMetricsGrouped(metricsRes.data.grouped);
      }
    } catch (err) {
      console.error('[Dashboard Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleTask = async (taskId) => {
    try {
      await api.patch(`/recommendations/${taskId}/toggle`);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update task status.');
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logFormData.value) return;

    setIsLogging(true);
    try {
      const res = await api.post('/metrics', logFormData);
      if (res.data.success) {
        toast.success('Health measurement logged!');
        setIsLogModalOpen(false);
        setLogFormData({
          metricType: 'blood_glucose',
          value: '',
          secondaryValue: '',
          unit: 'mg/dL',
          notes: '',
        });
        fetchDashboardData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to log measurement.');
    } finally {
      setIsLogging(false);
    }
  };

  const handleMetricTypeChange = (type) => {
    let unit = 'mg/dL';
    if (type === 'blood_pressure') unit = 'mmHg';
    else if (type === 'weight') unit = 'kg';
    else if (type === 'heart_rate') unit = 'bpm';
    else if (type === 'hba1c') unit = '%';
    else if (type === 'vitamin_d') unit = 'ng/mL';

    setLogFormData({ ...logFormData, metricType: type, unit });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b5755] dark:text-[#4aa497]">
            Patient Portal Command
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Hello, {user?.name || 'Patient'}
          </h1>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-0.5">
            Your clinical summary and vital biomarker trajectories are up to date.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <Link to="/reports/analyze">
            <Button variant="primary" size="md" icon={FileSearch}>
              Analyze Report
            </Button>
          </Link>
          <Link to="/symptoms/search">
            <Button variant="secondary" size="md" icon={Stethoscope}>
              Symptom Triage
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Grid: Health Score & Quick Navigation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <HealthScoreCard
          score={summary?.healthScore || 84}
          taskRate={summary?.taskCompletionRate || 75}
          reportsCount={summary?.reportsCount || 0}
        />

        {/* Quick Upload Action Card */}
        <Link
          to="/reports/analyze"
          className="glass-card rounded-3xl p-6 hover:border-[#b8ded5] transition-all flex flex-col justify-between group shadow-card"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif-heading text-[#122b2e] dark:text-white">
              Analyze Lab Report
            </h3>
            <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] leading-relaxed">
              Upload PDF or scanned lab documents to extract parameters, detect abnormal ranges, and download summary PDFs.
            </p>
          </div>
          <span className="text-xs text-[#0b5755] dark:text-[#4aa497] font-semibold flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
            Upload & Synthesize <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        {/* Quick Symptom Triage Card */}
        <Link
          to="/symptoms/search"
          className="glass-card rounded-3xl p-6 hover:border-[#b8ded5] transition-all flex flex-col justify-between group shadow-card"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf5f0] dark:bg-[#13382c] text-[#1c644d] dark:text-[#86e2bf] flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-serif-heading text-[#122b2e] dark:text-white">
              Symptom Triage Engine
            </h3>
            <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] leading-relaxed">
              Search any medical condition or symptom to get plain-language overviews, safe OTC categories, and recovery checklists.
            </p>
          </div>
          <span className="text-xs text-[#1c644d] dark:text-[#86e2bf] font-semibold flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
            Launch Symptom Triage <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>

      {/* Main Charts & Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Biometrics Area Chart */}
        <div className="lg:col-span-2">
          <MetricsChart
            metricsGrouped={metricsGrouped}
            onOpenLogModal={() => setIsLogModalOpen(true)}
          />
        </div>

        {/* Right 1 Col: Daily Action Tasks */}
        <div>
          <UpcomingTasksWidget
            tasks={summary?.pendingTasks || []}
            onToggleTask={handleToggleTask}
            onOpenAddTask={() => {}}
          />
        </div>
      </div>

      {/* Recent Analyzed Reports Section */}
      <div>
        <RecentReportsWidget reports={summary?.recentReports || []} />
      </div>

      {/* Log Measurement Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Vital Sign / Measurement"
        subtitle="Add a manual blood sugar, blood pressure, cholesterol, or weight record."
      >
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
              Measurement Type
            </label>
            <select
              value={logFormData.metricType}
              onChange={(e) => handleMetricTypeChange(e.target.value)}
              className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
            >
              <option value="blood_glucose">Fasting Blood Glucose (mg/dL)</option>
              <option value="total_cholesterol">Total Cholesterol (mg/dL)</option>
              <option value="ldl_cholesterol">LDL Cholesterol (mg/dL)</option>
              <option value="blood_pressure">Blood Pressure (mmHg)</option>
              <option value="weight">Body Weight (kg)</option>
              <option value="heart_rate">Resting Heart Rate (bpm)</option>
              <option value="hba1c">HbA1c Glycemic Index (%)</option>
              <option value="vitamin_d">25-Hydroxy Vitamin D (ng/mL)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={logFormData.metricType === 'blood_pressure' ? 'Systolic (e.g. 120)' : 'Result Value'}
              type="number"
              step="any"
              placeholder="e.g. 110"
              value={logFormData.value}
              onChange={(e) => setLogFormData({ ...logFormData, value: e.target.value })}
              required
            />

            {logFormData.metricType === 'blood_pressure' ? (
              <Input
                label="Diastolic (e.g. 80)"
                type="number"
                step="any"
                placeholder="e.g. 80"
                value={logFormData.secondaryValue}
                onChange={(e) => setLogFormData({ ...logFormData, secondaryValue: e.target.value })}
                required
              />
            ) : (
              <Input
                label="Measurement Unit"
                type="text"
                value={logFormData.unit}
                onChange={(e) => setLogFormData({ ...logFormData, unit: e.target.value })}
                required
              />
            )}
          </div>

          <Input
            label="Optional Clinical Notes"
            type="text"
            placeholder="e.g. Fasting 10 hours, morning test"
            value={logFormData.notes}
            onChange={(e) => setLogFormData({ ...logFormData, notes: e.target.value })}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="md" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLogging}
              icon={Plus}
            >
              Log Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardPage;
