import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { Task, TaskStatus } from '../../types';
import {
  Clock,
  Calendar,
  FolderGit2,
  User,
  MessageSquare,
  Send,
  Edit2,
  Trash2,
  Tag,
  CheckCircle,
} from 'lucide-react';

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  const { projects, employees, moveTaskStatus, user, showToast } = useNexus();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<
    Array<{ id: string; author: string; avatar: string; text: string; time: string }>
  >([
    {
      id: 'c-1',
      author: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Staging environment is configured and ready for regression testing.',
      time: '2 hours ago',
    },
    {
      id: 'c-2',
      author: 'Devon Lane',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      text: 'Verified Vault policy tokens. Automated rotation verified on 60 min intervals.',
      time: '45 mins ago',
    },
  ]);

  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const assignee = employees.find((e) => e.id === task.assigneeId);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: user.name,
        avatar: user.avatar,
        text: commentText.trim(),
        time: 'Just now',
      },
    ]);
    setCommentText('');
    showToast('Comment posted', 'info');
  };

  const statusOptions: TaskStatus[] = ['Backlog', 'To Do', 'In Progress', 'In Review', 'Done'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-2">
          {task.status === 'Done' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-purple-400 shrink-0" />
          )}
          <span className="text-slate-100">{task.title}</span>
        </div>
      }
      description={
        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
          <PriorityBadge priority={task.priority} size="sm" />
          <StatusBadge status={task.status} size="sm" />
          {project && (
            <span className="text-xs text-purple-300 font-medium">
              [{project.key}] {project.title}
            </span>
          )}
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-between">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            Delete Task
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Edit2 className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              Edit Task
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status Pipeline Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Status Lane
          </label>
          <div className="grid grid-cols-5 gap-1.5 p-1 rounded-xl bg-[#101522] border border-[#293449]">
            {statusOptions.map((st) => (
              <button
                key={st}
                onClick={() => moveTaskStatus(task.id, st)}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                  task.status === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Details
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed bg-[#101522] p-3 rounded-xl border border-[#293449]">
            {task.description || 'No detailed instructions provided.'}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Assigned To</span>
            </div>
            {assignee ? (
              <div className="flex items-center gap-2 mt-2">
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{assignee.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{assignee.role}</div>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400 mt-1 block">Unassigned</span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Due Date</span>
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-2">{task.dueDate}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Created: {task.createdDate}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Time Tracking</span>
            </div>
            <div className="text-sm font-semibold text-slate-200 mt-2">
              {task.spentHours}h <span className="text-xs text-slate-400">/ {task.estimatedHours}h est.</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((task.spentHours / (task.estimatedHours || 1)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded bg-slate-800 text-slate-300 border border-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Activity & Comments Thread */}
        <div className="border-t border-[#293449] pt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            Activity & Discussion ({comments.length})
          </h4>

          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#101522] border border-[#293449]">
                <img src={c.avatar} alt={c.author} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{c.author}</span>
                    <span className="text-[10px] text-slate-500">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Leave an operational comment or status update..."
              className="flex-1 px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <Button variant="primary" size="sm" type="submit" icon={<Send className="w-3.5 h-3.5" />}>
              Post
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
};
