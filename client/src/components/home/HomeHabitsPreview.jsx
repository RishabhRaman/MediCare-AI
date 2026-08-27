import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const HABIT_PROGRAMS = {
  metabolic: {
    name: 'Cardiometabolic & Glucose Balance',
    badge: 'Metabolic Focus',
    tasks: [
      { id: 'm1', text: '15-minute post-meal brisk walk to reduce glycemic spikes', category: 'Exercise', points: 15 },
      { id: 'm2', text: 'Incorporate 25g+ soluble dietary fiber (oats, chia, lentils)', category: 'Diet', points: 20 },
      { id: 'm3', text: 'Log morning fasting glucose reading in metrics tracker', category: 'Biometrics', points: 10 },
      { id: 'm4', text: 'Maintain 2.5L daily hydration; eliminate sugary beverages', category: 'Hydration', points: 15 },
    ],
  },
  hypertension: {
    name: 'Blood Pressure & Vascular Tone',
    badge: 'Cardiovascular Focus',
    tasks: [
      { id: 'h1', text: 'DASH diet adherence: Sodium intake < 1,800 mg/day', category: 'Diet', points: 20 },
      { id: 'h2', text: '10-minute resonance breathing exercise (5.5s inhale / exhale)', category: 'Stress Recovery', points: 15 },
      { id: 'h3', text: 'Check resting seated blood pressure twice (morning & evening)', category: 'Biometrics', points: 15 },
      { id: 'h4', text: 'Take prescribed magnesium / potassium dietary sources', category: 'Supplement', points: 10 },
    ],
  },
  energy: {
    name: 'Vitality, Sleep & Fatigue Recovery',
    badge: 'Recovery Focus',
    tasks: [
      { id: 'e1', text: '10 minutes of direct morning sunlight within 30 min of waking', category: 'Circadian', points: 15 },
      { id: 'e2', text: 'Complete 30 min of moderate aerobic zone-2 exercise', category: 'Fitness', points: 25 },
      { id: 'e3', text: 'No caffeine after 2:00 PM to protect deep REM sleep architecture', category: 'Sleep Hygiene', points: 15 },
      { id: 'e4', text: 'Screen shutdown & dim lighting 45 minutes before sleep', category: 'Recovery', points: 15 },
    ],
  },
};

const HomeHabitsPreview = () => {
  const { isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [activeProgram, setActiveProgram] = useState('metabolic');
  const [completed, setCompleted] = useState(['m1']);

  const currentProgram = HABIT_PROGRAMS[activeProgram];

  const toggleTask = (taskId) => {
    if (completed.includes(taskId)) {
      setCompleted(completed.filter((id) => id !== taskId));
    } else {
      setCompleted([...completed, taskId]);
    }
  };

  const completedCount = currentProgram.tasks.filter((t) => completed.includes(t.id)).length;
  const totalCount = currentProgram.tasks.length;
  const adherencePercent = Math.round((completedCount / totalCount) * 100);

  const handleGoToRecommendations = async () => {
    if (isAuthenticated) {
      navigate('/recommendations');
    } else {
      const res = await demoLogin();
      if (res.success) {
        navigate('/recommendations');
      }
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2ebe7] dark:border-[#1c4246]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center shrink-0 shadow-subtle">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif-heading text-[#122b2e] dark:text-white">
              Daily Recovery Habit Engine
            </h3>
            <p className="text-xs text-[#425b59] dark:text-[#b4cbc6]">
              Translate lab findings and symptoms into structured daily actionable checklists.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleGoToRecommendations}
          icon={TrendingUp}
        >
          {isAuthenticated ? 'Open Task Portal' : '1-Click Habit Tour'}
        </Button>
      </div>

      {/* Program Selector */}
      <div className="flex flex-wrap gap-2 pb-2">
        {Object.entries(HABIT_PROGRAMS).map(([key, prog]) => (
          <button
            key={key}
            onClick={() => {
              setActiveProgram(key);
              setCompleted([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeProgram === key
                ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                : 'bg-[#f3f7f5] dark:bg-[#143236] text-[#425b59] dark:text-[#b4cbc6] hover:bg-[#eaf2ee]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            {prog.name}
          </button>
        ))}
      </div>

      {/* Adherence Score Progress Bar */}
      <div className="p-4 rounded-2xl bg-[#f8faf8] dark:bg-[#0c1e20] border border-[#e2ebe7] dark:border-[#1c4246] space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-[#122b2e] dark:text-white">
          <div className="flex items-center gap-2">
            <span>Daily Clinical Adherence Score</span>
            <Badge variant={adherencePercent >= 75 ? 'normal' : adherencePercent >= 50 ? 'borderline' : 'low'}>
              {adherencePercent}% Completed
            </Badge>
          </div>
          <span className="text-[#0b5755] dark:text-[#4aa497]">
            {completedCount} of {totalCount} habits done
          </span>
        </div>
        <div className="w-full bg-[#d6e4df] dark:bg-[#1c4246] h-2.5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${adherencePercent}%` }}
            transition={{ duration: 0.4 }}
            className="bg-[#0b5755] dark:bg-[#4aa497] h-full rounded-full"
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {currentProgram.tasks.map((task) => {
          const isDone = completed.includes(task.id);
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-[#dcefe9]/50 dark:bg-[#173b3f]/40 border-[#b8ded5] dark:border-[#2c5f64]'
                  : 'bg-white dark:bg-[#102629] border-[#e2ebe7] dark:border-[#1c4246] hover:border-[#b8ded5]'
              }`}
            >
              <div className="flex items-center gap-3.5">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-[#0b5755] dark:text-[#4aa497] shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[#9cb5af] shrink-0" />
                )}
                <div>
                  <p
                    className={`text-xs sm:text-sm font-semibold ${
                      isDone
                        ? 'line-through text-[#6b8582] dark:text-[#7e9d97]'
                        : 'text-[#122b2e] dark:text-white'
                    }`}
                  >
                    {task.text}
                  </p>
                  <span className="text-[10px] font-bold text-[#0b5755] dark:text-[#4aa497] uppercase tracking-wider">
                    {task.category}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#f3f7f5] dark:bg-[#143236] text-[#425b59] dark:text-[#b4cbc6] shrink-0">
                +{task.points} pts
              </span>
            </div>
          );
        })}
      </div>

      {/* Portal Hook */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b8582] dark:text-[#7e9d97]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#3d8b72]" />
          <span>Personalized tasks sync seamlessly with your patient portal health score.</span>
        </div>
        <button
          type="button"
          onClick={handleGoToRecommendations}
          className="text-xs font-bold text-[#0b5755] dark:text-[#4aa497] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Manage custom tasks in portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default HomeHabitsPreview;
