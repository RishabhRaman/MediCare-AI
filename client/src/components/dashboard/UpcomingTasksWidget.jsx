import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Check, ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge';

const UpcomingTasksWidget = ({ tasks = [], onToggleTask, onOpenAddTask }) => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-[#3d8b72]" />
          <h3 className="text-lg font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Daily Action Tasks
          </h3>
        </div>
        <Link
          to="/recommendations"
          className="text-xs text-[#0b5755] dark:text-[#4aa497] hover:underline font-semibold flex items-center gap-1"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-6 text-[#6b8582] dark:text-[#7e9d97] text-xs">
          <p>No pending tasks for today!</p>
          <button
            onClick={onOpenAddTask}
            className="mt-2 text-[#0b5755] dark:text-[#4aa497] hover:underline font-semibold cursor-pointer"
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
              className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all duration-150 ${
                task.status === 'completed'
                  ? 'bg-[#eaf5f0]/40 dark:bg-[#13382c]/20 border-[#c0e6d6] dark:border-[#1f5c49] text-[#6b8582] line-through'
                  : 'bg-[#f8faf8] dark:bg-[#0c1e20] border-[#e2ebe7] dark:border-[#1c4246] hover:border-[#b8ded5] text-[#122b2e] dark:text-[#edf7f3]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                  task.status === 'completed'
                    ? 'bg-[#10b981] border-[#10b981] text-white'
                    : 'border-[#d6e4df] dark:border-[#1c4246]'
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
