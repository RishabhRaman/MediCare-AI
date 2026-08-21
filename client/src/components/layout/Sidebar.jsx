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
  ShieldAlert,
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
    <aside className="w-64 shrink-0 hidden md:block border-r border-[#d7e2df] dark:border-[#294543] bg-[#eef4f2] dark:bg-[#0d2527] min-h-[calc(100vh-4rem)] p-4 transition-all duration-200">
      {/* Navigation Group */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          Clinical Portal
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-white dark:bg-[#173b3f] text-[#0b5755] dark:text-[#b8ded5] border-l-4 border-[#0f6b68] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-colors group-hover:text-sky-500 dark:group-hover:text-sky-400" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Safety Compliance & AI Badge Card */}
      <div className="mt-8 p-3.5 rounded-lg bg-[#173b3f] border border-[#416360] text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>AI Clinical Intelligence</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Reports and symptoms are synthesized with structured OCR & medical models.
        </p>
        <div className="pt-1 flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted & Privacy-First</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
