import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-xl border border-sky-500/30 text-xs shadow-xl">
        <p className="font-semibold text-slate-400 mb-1">{label}</p>
        <p className="font-bold text-sky-400 text-sm">
          {payload[0].name}: {payload[0].value} {unit}
        </p>
        {payload[1] && (
          <p className="font-bold text-cyan-300 text-sm">
            {payload[1].name}: {payload[1].value} {unit}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const MetricsChart = ({ metricsGrouped = {}, onOpenLogModal }) => {
  const [selectedMetric, setSelectedMetric] = useState('blood_glucose');

  const metricConfigs = {
    blood_glucose: {
      title: 'Fasting Blood Glucose',
      unit: 'mg/dL',
      threshold: 100,
      thresholdLabel: 'Pre-diabetes threshold (100 mg/dL)',
      color: '#0ea5e9',
      gradientId: 'glucoseGrad',
    },
    total_cholesterol: {
      title: 'Total Cholesterol',
      unit: 'mg/dL',
      threshold: 200,
      thresholdLabel: 'Target (< 200 mg/dL)',
      color: '#f59e0b',
      gradientId: 'cholGrad',
    },
    blood_pressure: {
      title: 'Blood Pressure (Sys / Dia)',
      unit: 'mmHg',
      threshold: 120,
      thresholdLabel: 'Normal (< 120/80)',
      color: '#ef4444',
      gradientId: 'bpGrad',
    },
    weight: {
      title: 'Body Weight',
      unit: 'kg',
      threshold: 75,
      thresholdLabel: 'Target Weight (75 kg)',
      color: '#10b981',
      gradientId: 'weightGrad',
    },
  };

  const currentConfig = metricConfigs[selectedMetric] || metricConfigs.blood_glucose;
  const rawData = metricsGrouped[selectedMetric] || [];

  // Format data for Recharts
  const chartData = rawData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.value,
    secondaryValue: item.secondaryValue,
    status: item.status,
  }));

  // Fallback if no items
  const displayData =
    chartData.length > 0
      ? chartData
      : [
          { date: '1 Month Ago', value: 118 },
          { date: '2 Weeks Ago', value: 112 },
          { date: '1 Week Ago', value: 106 },
          { date: 'Latest', value: 98 },
        ];

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-sky-500" />
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Biometric Trajectory & Trends
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track longitudinal biomarkers extracted from your reports or logged manually.
            </p>
          </div>
        </div>

        {onOpenLogModal && (
          <Button variant="secondary" size="sm" onClick={onOpenLogModal} icon={Plus}>
            Log Measurement
          </Button>
        )}
      </div>

      {/* Metric Selectors */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {Object.entries(metricConfigs).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setSelectedMetric(key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedMetric === key
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {cfg.title}
          </button>
        ))}
      </div>

      {/* Recharts Area Container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={currentConfig.gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={currentConfig.color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={currentConfig.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip content={<CustomTooltip unit={currentConfig.unit} />} />
            {currentConfig.threshold && (
              <ReferenceLine
                y={currentConfig.threshold}
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{
                  value: currentConfig.thresholdLabel,
                  fill: '#94a3b8',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="value"
              name={currentConfig.title}
              stroke={currentConfig.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${currentConfig.gradientId})`}
            />
            {selectedMetric === 'blood_pressure' && (
              <Area
                type="monotone"
                dataKey="secondaryValue"
                name="Diastolic BP"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={0}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;
