import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertOctagon,
  ShieldCheck,
  Pill,
  Home,
  CheckCircle,
  PlusCircle,
  Stethoscope,
  Sparkles,
  AlertTriangle,
  Bookmark,
  Check,
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SymptomTriageResult = ({ result, query, searchId, onAddTasks }) => {
  const [checklist, setChecklist] = useState(result.recoveryChecklist || []);
  const [isAddingTasks, setIsAddingTasks] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleTask = (index) => {
    setChecklist((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const handleSyncToMyTasks = async () => {
    if (checklist.length === 0) return;
    setIsAddingTasks(true);
    try {
      const res = await api.post('/recommendations/batch', {
        tasks: checklist,
        source: `Symptom Check: ${result.conditionName || query}`,
      });
      if (res.data.success) {
        toast.success(`Added ${res.data.count} recovery tasks to your dashboard!`);
        if (onAddTasks) onAddTasks();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add tasks.');
    } finally {
      setIsAddingTasks(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!searchId) return;
    try {
      await api.patch(`/search/history/${searchId}/bookmark`);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? 'Bookmark removed.' : 'Search bookmarked!');
    } catch (err) {
      toast.error(err.message || 'Failed to toggle bookmark.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-sky-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs text-sky-500 font-bold uppercase tracking-wider">
                Clinical Triage Evaluation
              </span>
              {result.isEmergency && (
                <Badge variant="critical" size="sm">
                  EMERGENCY
                </Badge>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {result.conditionName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Evaluated Query: <span className="font-semibold text-slate-700 dark:text-slate-300">"{query}"</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {searchId && (
              <Button
                variant={isBookmarked ? 'primary' : 'secondary'}
                size="sm"
                onClick={handleToggleBookmark}
                icon={Bookmark}
              >
                {isBookmarked ? 'Bookmarked' : 'Save Search'}
              </Button>
            )}
          </div>
        </div>

        {/* Clinical Overview */}
        <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-500/20 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
          {result.overview}
        </div>

        {/* Causes & Risk Factors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Common Underlying Causes
            </h4>
            <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-2">
              {(result.commonCauses || []).map((cause, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Suggested Specialist Consultation
            </h4>
            <div className="flex items-center gap-2.5 pt-2">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {result.doctorSpecialtyToConsult || 'General Practitioner'}
                </p>
                <p className="text-xs text-slate-500">Recommended clinical physician</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* General OTC Medicine Categories (Strictly educational with dosage warnings) */}
      {result.generalOtcCategories && result.generalOtcCategories.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Pill className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  General Over-the-Counter (OTC) Categories
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Educational categorization. MediCare AI never generates exact milligram dosages. Consult a licensed pharmacist.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.generalOtcCategories.map((cat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {cat.categoryName}
                  </h4>
                  <Badge variant="primary" size="sm">
                    OTC Class
                  </Badge>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Purpose: </strong>
                  {cat.purpose}
                </p>
                {cat.examples && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">Common Examples: </strong>
                    {cat.examples.join(', ')}
                  </p>
                )}
                {cat.precautions && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/90 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                    ⚠️ Safety Note: {cat.precautions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Home-Care Protocols & Recovery Checklist */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Home className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Actionable Home-Care & Recovery Checklist
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mark off self-care tasks as you complete them or sync to your personal health dashboard.
              </p>
            </div>
          </div>

          <Button
            variant="emerald"
            size="sm"
            onClick={handleSyncToMyTasks}
            loading={isAddingTasks}
            icon={PlusCircle}
          >
            Add to My Action Tasks
          </Button>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          {checklist.map((item, idx) => (
            <div
              key={idx}
              onClick={() => toggleTask(idx)}
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
                item.isCompleted
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/40 text-slate-400 line-through'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-sky-500/40 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  item.isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {item.isCompleted && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <span>{item.task}</span>
                {item.timeline && (
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 no-underline inline-block">
                    {item.timeline}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Red-Flag Urgent Warnings */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="p-6 rounded-3xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-500/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Red-Flag Warning Symptoms (Seek Urgent Medical Evaluation)</span>
          </div>
          <ul className="text-xs text-rose-950 dark:text-rose-200 space-y-2">
            {result.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SymptomTriageResult;
