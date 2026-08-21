import React, { useState, useEffect } from 'react';
import {
  Activity,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Layers,
  Heart,
  Droplet,
  Scale,
} from 'lucide-react';
import api from '../services/api';
import MetricsChart from '../components/dashboard/MetricsChart';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { SkeletonTable } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const MetricsPage = () => {
  const [metrics, setMetrics] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logFormData, setLogFormData] = useState({
    metricType: 'blood_glucose',
    value: '',
    secondaryValue: '',
    unit: 'mg/dL',
    notes: '',
  });
  const [isLogging, setIsLogging] = useState(false);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/metrics');
      if (res.data.success) {
        setMetrics(res.data.metrics.reverse()); // latest first for table
        setGrouped(res.data.grouped);
      }
    } catch (err) {
      toast.error('Failed to load biometric metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/metrics/${id}`);
      setMetrics(metrics.filter((m) => m._id !== id));
      toast.success('Measurement deleted.');
      fetchMetrics();
    } catch (err) {
      toast.error('Failed to delete measurement.');
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logFormData.value) return;

    setIsLogging(true);
    try {
      const res = await api.post('/metrics', logFormData);
      if (res.data.success) {
        toast.success('Biometric entry saved!');
        setIsLogModalOpen(false);
        setLogFormData({
          metricType: 'blood_glucose',
          value: '',
          secondaryValue: '',
          unit: 'mg/dL',
          notes: '',
        });
        fetchMetrics();
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-500">
            Biometric Monitoring
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Health Metrics & Vital Signs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Longitudinal tracking of blood glucose, lipid parameters, blood pressure, and weight.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsLogModalOpen(true)}
          icon={Plus}
          className="shadow-md shadow-sky-500/20"
        >
          Log Measurement
        </Button>
      </div>

      {/* Main Interactive Recharts Chart */}
      <MetricsChart
        metricsGrouped={grouped}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* Measurement History Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-sky-500" />
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Recorded Biomarker Logs
            </h3>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {metrics.length} Total Logs
          </span>
        </div>

        {loading ? (
          <SkeletonTable rows={4} />
        ) : metrics.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No biomarker measurements logged yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 rounded-l-xl">Biomarker</th>
                  <th className="px-4 py-3.5">Measured Value</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date Recorded</th>
                  <th className="px-4 py-3.5">Notes</th>
                  <th className="px-4 py-3.5 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                {metrics.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {item.metricName}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                      {item.value} {item.secondaryValue ? `/ ${item.secondaryValue}` : ''}{' '}
                      <span className="text-xs font-normal text-slate-500">{item.unit}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge
                        variant={
                          item.status === 'high' || item.status === 'critical'
                            ? 'high'
                            : item.status === 'low'
                            ? 'low'
                            : item.status === 'borderline'
                            ? 'borderline'
                            : 'normal'
                        }
                        size="sm"
                        dot
                      >
                        {(item.status || 'normal').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 max-w-xs truncate">
                      {item.notes || '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Measurement Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Vital Sign / Biomarker"
        subtitle="Add manual test results to track trend trajectory."
      >
        <form onSubmit={handleLogSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Measurement Type
            </label>
            <select
              value={logFormData.metricType}
              onChange={(e) => handleMetricTypeChange(e.target.value)}
              className="w-full rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-slate-900 dark:text-slate-100"
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
            label="Clinical Context Notes (Optional)"
            type="text"
            placeholder="e.g. 12-hour fasting morning reading"
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
              Save Measurement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MetricsPage;
