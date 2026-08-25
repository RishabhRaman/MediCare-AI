import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Check,
  Trash2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { SkeletonTable } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const RecommendationsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // New Task Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'diet',
    priority: 'medium',
    dueDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/recommendations', {
        params: { status: statusFilter, category: categoryFilter },
      });
      if (res.data.success) {
        setTasks(res.data.tasks);
        setStats(res.data.stats);
      }
    } catch (err) {
      toast.error('Failed to load health action tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, categoryFilter]);

  const handleToggle = async (id) => {
    try {
      const res = await api.patch(`/recommendations/${id}/toggle`);
      if (res.data.success) {
        fetchTasks();
      }
    } catch (err) {
      toast.error('Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/recommendations/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
      toast.success('Task removed.');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task.');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post('/recommendations', formData);
      if (res.data.success) {
        toast.success('Action task created successfully!');
        setIsModalOpen(false);
        setFormData({
          title: '',
          description: '',
          category: 'diet',
          priority: 'medium',
          dueDate: '',
        });
        fetchTasks();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b5755] dark:text-[#4aa497]">
            Actionable Next Steps
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
            Health Tasks & Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-0.5">
            Manage dietary goals, lifestyle interventions, and diagnostic test follow-ups.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          icon={Plus}
        >
          Add Health Habit / Task
        </Button>
      </div>

      {/* Stats Summary Bar */}
      <div className="glass-card rounded-3xl p-6 shadow-card grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6b8582] dark:text-[#7e9d97]">Total Action Items</p>
          <p className="text-2xl font-bold font-serif-heading text-[#122b2e] dark:text-white">{stats.total}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6b8582] dark:text-[#7e9d97]">Pending Tasks</p>
          <p className="text-2xl font-bold font-serif-heading text-[#d97706]">{stats.pending}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6b8582] dark:text-[#7e9d97]">Completed</p>
          <p className="text-2xl font-bold font-serif-heading text-[#1c644d] dark:text-[#86e2bf]">{stats.completed}</p>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#6b8582] dark:text-[#7e9d97]">Adherence Rate</span>
            <span className="text-[#0b5755] dark:text-[#4aa497] font-bold">{stats.completionRate}%</span>
          </div>
          <div className="w-full h-2 bg-[#e2ebe7] dark:bg-[#1c4246] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0b5755] dark:bg-[#4aa497] rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between border-b border-[#e2ebe7] dark:border-[#1c4246] pb-3">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                  : 'text-[#425b59] dark:text-[#b4cbc6] hover:bg-[#f3f7f5] dark:hover:bg-[#143236]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium border border-[#d6e4df] dark:border-[#1c4246] bg-white dark:bg-[#0c1e20] text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
        >
          <option value="all">All Categories</option>
          <option value="diet">Diet & Nutrition</option>
          <option value="exercise">Exercise & Cardio</option>
          <option value="lifestyle">Lifestyle & Sleep</option>
          <option value="diagnostic">Diagnostic Follow-ups</option>
          <option value="symptom_care">Symptom Care</option>
          <option value="hydration">Hydration</option>
        </select>
      </div>

      {/* Task Cards List */}
      {loading ? (
        <SkeletonTable rows={4} />
      ) : tasks.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-[#6b8582] dark:text-[#7e9d97] space-y-3 shadow-card">
          <CheckSquare className="w-12 h-12 text-[#6b8582] mx-auto" />
          <h3 className="text-base font-bold font-serif-heading text-[#122b2e] dark:text-white">
            No health tasks match this view
          </h3>
          <p className="text-xs max-w-sm mx-auto">
            Add custom goals or synthesize tasks automatically from medical report analyses and symptom searches.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`glass-card rounded-2xl p-4 sm:p-5 shadow-card flex items-start justify-between gap-4 transition-all duration-150 ${
                task.status === 'completed' ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  onClick={() => handleToggle(task._id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border transition-all cursor-pointer ${
                    task.status === 'completed'
                      ? 'bg-[#10b981] border-[#10b981] text-white'
                      : 'border-[#d6e4df] dark:border-[#1c4246] hover:border-[#0b5755]'
                  }`}
                >
                  {task.status === 'completed' && <Check className="w-4 h-4" />}
                </button>

                <div className="space-y-1 min-w-0">
                  <h4
                    className={`text-sm sm:text-base font-bold text-[#122b2e] dark:text-white ${
                      task.status === 'completed' ? 'line-through text-[#6b8582]' : ''
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] leading-relaxed">
                      {task.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge variant="default" size="sm">
                      {task.category?.toUpperCase()}
                    </Badge>
                    <Badge
                      variant={
                        task.priority === 'urgent'
                          ? 'critical'
                          : task.priority === 'high'
                          ? 'high'
                          : 'default'
                      }
                      size="sm"
                    >
                      {task.priority?.toUpperCase()} PRIORITY
                    </Badge>
                    {task.dueDate && (
                      <span className="text-[11px] text-[#6b8582] dark:text-[#7e9d97] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Due:{' '}
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(task._id)}
                className="text-[#6b8582] hover:text-red-500 p-2 rounded-xl hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Actionable Health Task"
        subtitle="Create a personalized self-care goal or diagnostic reminder."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            type="text"
            placeholder="e.g. Include 15g Soluble Fiber at Breakfast"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Oatmeal with chia seeds to support cholesterol regulation."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] p-3 text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
              >
                <option value="diet">Diet & Nutrition</option>
                <option value="exercise">Exercise & Cardio</option>
                <option value="lifestyle">Lifestyle & Sleep</option>
                <option value="diagnostic">Diagnostic Follow-up</option>
                <option value="hydration">Hydration</option>
                <option value="symptom_care">Symptom Care</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] px-3.5 py-2.5 text-[#122b2e] dark:text-[#edf7f3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              icon={Plus}
            >
              Save Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecommendationsPage;
