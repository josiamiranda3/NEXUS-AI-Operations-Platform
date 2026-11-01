import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatusBadge, PriorityBadge } from '../ui/Badge';
import { Project } from '../../types';
import {
  Calendar,
  DollarSign,
  AlertTriangle,
  User,
  Users,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Tag,
} from 'lucide-react';

interface ProjectDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  isOpen,
  onClose,
  project,
  onEdit,
  onDelete,
}) => {
  const { employees, tasks, moveTaskStatus } = useNexus();

  if (!project) return null;

  const lead = employees.find((e) => e.id === project.leadId);
  const teamMembers = employees.filter((e) => project.memberIds.includes(e.id));
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const completedTasks = projectTasks.filter((t) => t.status === 'Done');

  const budgetUsagePercent = Math.min(
    100,
    Math.round((project.spent / (project.budget || 1)) * 100)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {project.key}
          </span>
          <span className="text-slate-100">{project.title}</span>
        </div>
      }
      description={
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <StatusBadge status={project.status} size="sm" />
          <PriorityBadge priority={project.priority} size="sm" />
          <span className="text-xs text-slate-400">Department: {project.department}</span>
          <span className="text-xs text-slate-400">
            Health: <strong className="text-emerald-400">{project.healthScore}%</strong>
          </span>
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
              onDelete(project);
            }}
          >
            Delete Project
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
                onEdit(project);
              }}
            >
              Edit Project
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Overview & Intent
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed bg-[#101522] p-3 rounded-xl border border-[#293449]">
            {project.description}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Budget Allocation</span>
            </div>
            <div className="text-base font-bold text-slate-100 mt-1">
              ${project.budget.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ${project.spent.toLocaleString()} spent ({budgetUsagePercent}%)
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Due Date</span>
            </div>
            <div className="text-base font-bold text-slate-100 mt-1">{project.dueDate}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Started: {project.startDate}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Milestone Progress</span>
            </div>
            <div className="text-base font-bold text-purple-300 mt-1">{project.progress}%</div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {completedTasks.length} of {projectTasks.length} tasks closed
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <AlertTriangle
                className={`w-4 h-4 ${
                  project.riskLevel === 'High'
                    ? 'text-rose-400'
                    : project.riskLevel === 'Moderate'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              />
              <span>Risk Profile</span>
            </div>
            <div className="text-base font-bold text-slate-100 mt-1">{project.riskLevel} Risk</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Health: {project.healthScore}/100</div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Progress toward completion</span>
            <span className="font-semibold text-slate-200">{project.progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Team Ownership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-400" />
              Project Lead
            </h4>
            {lead ? (
              <div className="flex items-center gap-3">
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-500/40"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-100">{lead.name}</div>
                  <div className="text-xs text-slate-400">{lead.role}</div>
                  <div className="text-[11px] text-purple-400">{lead.email}</div>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-400">Unassigned lead</span>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449]">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Allocated Team Members ({teamMembers.length})
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-200"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Associated Tasks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Initiative Tasks ({projectTasks.length})
            </h4>
            <span className="text-xs text-slate-400">
              {completedTasks.length} completed
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {projectTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">No tasks linked yet.</p>
            ) : (
              projectTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#101522] border border-[#293449] hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={t.status === 'Done'}
                      onChange={() =>
                        moveTaskStatus(t.id, t.status === 'Done' ? 'In Progress' : 'Done')
                      }
                      className="rounded accent-purple-500 cursor-pointer"
                    />
                    <span
                      className={`text-xs font-medium ${
                        t.status === 'Done' ? 'line-through text-slate-500' : 'text-slate-200'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={t.priority} size="xs" />
                    <StatusBadge status={t.status} size="xs" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded bg-purple-500/10 text-purple-300 border border-purple-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
