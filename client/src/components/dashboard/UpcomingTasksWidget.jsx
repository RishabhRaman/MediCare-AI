import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Check, ArrowRight, Clock, Plus } from 'lucide-react';
import Badge from '../ui/Badge';

const UpcomingTasksWidget = ({ tasks = [], onToggleTask, onOpenAddTask }) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Daily Action Tasks
          </h3>
        </div>
        <Link
          to="/recommendations"
          className="text-xs text-sky-500 hover:text-sky-400 font-semibold flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
          <p>No pending tasks for today!</p>
          <button
            onClick={onOpenAddTask}
            className="mt-2 text-sky-500 hover:underline font-semibold"
          >
            + Add a custom health habit
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.slice(0, 4).map((task) => (
            <div
              key={task._id}
              onClick={() => onToggleTask && onToggleTask(task._id)}
              className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all duration-150 ${
                task.status === 'completed'
                  ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-sky-500/40 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  task.status === 'completed'
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                {task.status === 'completed' && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate">{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="default" size="sm">
                    {task.category}
                  </Badge>
                  {task.priority === 'high' && (
                    <Badge variant="high" size="sm">
                      High Priority
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTasksWidget;
