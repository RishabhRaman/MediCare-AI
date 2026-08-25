import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSearch,
  Stethoscope,
  FolderClock,
  CheckSquare,
  Activity,
  UserCog,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Report Analyzer',
    path: '/reports/analyze',
    icon: FileSearch,
    badge: 'AI Vision',
  },
  {
    name: 'Symptom Triage',
    path: '/symptoms/search',
    icon: Stethoscope,
  },
  {
    name: 'Reports History',
    path: '/reports/history',
    icon: FolderClock,
  },
  {
    name: 'Action Tasks',
    path: '/recommendations',
    icon: CheckSquare,
  },
  {
    name: 'Biometrics & Trends',
    path: '/metrics',
    icon: Activity,
  },
  {
    name: 'Health Profile',
    path: '/profile',
    icon: UserCog,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-[#e2ebe7] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] min-h-[calc(100vh-5rem)] p-4 transition-colors duration-200">
      {/* Navigation Group */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#6b8582] dark:text-[#7e9d97] mb-2.5">
          Patient Portal
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-white dark:bg-[#102629] text-[#0b5755] dark:text-[#83c4b8] shadow-subtle border border-[#d6e4df] dark:border-[#1c4246]'
                    : 'text-[#425b59] dark:text-[#b4cbc6] hover:text-[#122b2e] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#143236]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-colors group-hover:text-[#0b5755] dark:group-hover:text-[#4aa497]" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#dcefe9] text-[#0b5755] dark:bg-[#173b3f] dark:text-[#83c4b8] border border-[#b8ded5] dark:border-[#2c5f64]">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Safety Compliance & AI Badge Card */}
      <div className="mt-8 p-4 rounded-2xl bg-white dark:bg-[#102629] border border-[#e2ebe7] dark:border-[#1c4246] text-[#425b59] dark:text-[#b4cbc6] space-y-2 shadow-subtle">
        <div className="flex items-center gap-2 text-[#0b5755] dark:text-[#4aa497] text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Clinical Intelligence</span>
        </div>
        <p className="text-[11px] text-[#6b8582] dark:text-[#7e9d97] leading-relaxed">
          Diagnostic OCR and symptom triage synthesize structured findings with active red-flag protocols.
        </p>
        <div className="pt-1 flex items-center gap-1.5 text-[10px] text-[#3d8b72] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>HIPAA-Inspired Privacy</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
