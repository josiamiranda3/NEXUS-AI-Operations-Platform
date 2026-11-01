import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { TaskCreateModal } from '../../components/modals/TaskCreateModal';
import { TaskEditModal } from '../../components/modals/TaskEditModal';
import { TaskDetailModal } from '../../components/modals/TaskDetailModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Task, TaskStatus, PriorityLevel } from '../../types';
import {
  CheckSquare,
  Columns3,
  List,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowRight,
  TrendingUp,
  Tag,
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, projects, employees, moveTaskStatus, deleteTask } = useNexus();
  const [searchParams] = useSearchParams();

  // Mode: 'kanban' or 'list'
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [assigneeFilter, setAssigneeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [targetLaneForCreate, setTargetLaneForCreate] = useState<TaskStatus>('To Do');

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Auto-open if query param exists
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const target = tasks.find((t) => t.id === id);
      if (target) {
        setSelectedTask(target);
        setDetailModalOpen(true);
      }
    }
  }, [searchParams, tasks]);

  // Productivity metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (projectFilter !== 'All' && t.projectId !== projectFilter) return false;
      if (assigneeFilter !== 'All' && t.assigneeId !== assigneeFilter) return false;
      if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
      if (statusFilter !== 'All' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [tasks, projectFilter, assigneeFilter, priorityFilter, statusFilter, searchQuery]);

  const kanbanColumns: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];

  // Drag and drop handlers
  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (lane: TaskStatus) => {
    if (draggedTaskId) {
      moveTaskStatus(draggedTaskId, lane);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Sprint & Task Operations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Kanban execution, assignee capacity, and time tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View toggle */}
          <div className="flex items-center rounded-xl bg-[#151c2c] p-1 border border-[#293449]">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board"
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setTargetLaneForCreate('To Do');
              setCreateModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Productivity Overview Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#151c2c] border border-[#293449]">
          <div className="text-xs text-slate-400">Total Sprinted Tasks</div>
          <div className="text-xl font-bold text-slate-100 mt-1">{totalTasks}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all initiatives</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#151c2c] border border-[#293449]">
          <div className="text-xs text-slate-400">In Active Flight</div>
          <div className="text-xl font-bold text-purple-300 mt-1">{inProgressTasks}</div>
          <div className="text-[11px] text-purple-400 mt-0.5">Under development</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#151c2c] border border-[#293449]">
          <div className="text-xs text-slate-400">Done / Closed</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{completedTasks}</div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Verified acceptance</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#151c2c] border border-[#293449]">
          <div className="text-xs text-slate-400">Completion Velocity</div>
          <div className="text-xl font-bold text-cyan-300 mt-1">{completionRate}%</div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title, criteria, or tags..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500 max-w-[150px] truncate"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.title}
                </option>
              ))}
            </select>

            {/* Assignee Filter */}
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Assignees</option>
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            {/* Status Filter for list view */}
            {viewMode === 'list' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
              >
                <option value="All">All Statuses</option>
                <option value="Backlog">Backlog</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            )}
          </div>
        </div>
      </Card>

      {/* Main Kanban / List View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 items-start">
          {kanbanColumns.map((lane) => {
            const laneTasks = filteredTasks.filter((t) => t.status === lane);
            return (
              <div
                key={lane}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(lane)}
                className="rounded-2xl border border-[#293449] bg-[#101522]/60 p-3 space-y-3 min-h-[450px] transition-colors"
              >
                {/* Lane Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{lane}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {laneTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setTargetLaneForCreate(lane);
                      setCreateModalOpen(true);
                    }}
                    className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                    title={`Add task to ${lane}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5">
                  {laneTasks.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-500 border border-dashed border-[#293449]/50 rounded-xl">
                      Drop tasks here
                    </div>
                  ) : (
                    laneTasks.map((t) => {
                      const project = projects.find((p) => p.id === t.projectId);
                      const assignee = employees.find((e) => e.id === t.assigneeId);

                      return (
                        <div
                          key={t.id}
                          draggable
                          onDragStart={() => handleDragStart(t.id)}
                          onClick={() => {
                            setSelectedTask(t);
                            setDetailModalOpen(true);
                          }}
                          className="p-3 rounded-xl bg-[#151c2c] border border-[#293449] hover:border-slate-500/80 cursor-grab active:cursor-grabbing transition-all shadow-sm group hover:-translate-y-0.5"
                        >
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            {project && (
                              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                                {project.key}
                              </span>
                            )}
                            <PriorityBadge priority={t.priority} size="xs" />
                          </div>

                          <h4 className="text-xs font-semibold text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                            {t.title}
                          </h4>

                          {/* Footer */}
                          <div className="mt-3 pt-2.5 border-t border-[#293449]/80 flex items-center justify-between text-[11px] text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-cyan-400" />
                              <span>{t.dueDate}</span>
                            </div>

                            {assignee && (
                              <img
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-500/30"
                                title={`Assignee: ${assignee.name}`}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List View
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101522] border-b border-[#293449] text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Task Title</th>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#293449]/50 text-slate-200">
                {filteredTasks.map((t) => {
                  const project = projects.find((p) => p.id === t.projectId);
                  const assignee = employees.find((e) => e.id === t.assigneeId);
                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedTask(t);
                        setDetailModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-100 line-clamp-1">
                          {t.title}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-purple-300">
                        {project ? `[${project.key}] ${project.title}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} size="xs" />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={t.priority} size="xs" />
                      </td>
                      <td className="px-4 py-3 text-slate-400">{t.dueDate}</td>
                      <td className="px-4 py-3">
                        {assignee && (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span>{assignee.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {t.spentHours}h / {t.estimatedHours}h
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedTask(t);
                              setEditModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-purple-300 hover:bg-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTask(t);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modals */}
      <TaskCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultStatus={targetLaneForCreate}
      />
      <TaskEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={selectedTask}
      />
      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onEdit={(task) => {
          setSelectedTask(task);
          setEditModalOpen(true);
        }}
        onDelete={(task) => {
          setSelectedTask(task);
          setDeleteConfirmOpen(true);
        }}
      />
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Operational Task"
        message={`Are you sure you want to remove task "${selectedTask?.title}" from the sprint board?`}
        confirmLabel="Delete Task"
        onConfirm={() => {
          if (selectedTask) {
            deleteTask(selectedTask.id);
          }
        }}
      />
    </div>
  );
};
