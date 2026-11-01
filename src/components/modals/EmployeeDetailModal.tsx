import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge, StatusBadge, PriorityBadge } from '../ui/Badge';
import { Employee } from '../../types';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  TrendingUp,
  FolderGit2,
  Edit2,
  Trash2,
} from 'lucide-react';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
  onEdit,
  onDelete,
}) => {
  const { projects, tasks } = useNexus();

  if (!employee) return null;

  const assignedProjects = projects.filter(
    (p) => p.leadId === employee.id || p.memberIds.includes(employee.id)
  );
  const assignedTasks = tasks.filter((t) => t.assigneeId === employee.id);
  const completedTasks = assignedTasks.filter((t) => t.status === 'Done');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        <div className="flex items-center gap-3">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500/50"
          />
          <div>
            <div className="text-slate-100 font-bold">{employee.name}</div>
            <div className="text-xs text-slate-400 font-normal">
              {employee.role} • {employee.department}
            </div>
          </div>
        </div>
      }
      description={
        <div className="flex items-center gap-2 mt-1">
          <Badge
            variant={
              employee.status === 'Active'
                ? 'success'
                : employee.status === 'Busy'
                ? 'warning'
                : 'neutral'
            }
            size="xs"
            dot
          >
            {employee.status}
          </Badge>
          <span className="text-xs text-slate-400">Joined {employee.joinedDate}</span>
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
              onDelete(employee);
            }}
          >
            Remove Member
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
                onEdit(employee);
              }}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Stats Header */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
              <span>Productivity</span>
            </div>
            <div className="text-lg font-bold text-purple-300 mt-1">
              {employee.productivityScore}%
            </div>
            <div className="text-[10px] text-slate-500">Benchmark: Top 5%</div>
          </div>

          <div className="p-3 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Initiatives</span>
            </div>
            <div className="text-lg font-bold text-slate-100 mt-1">
              {assignedProjects.length}
            </div>
            <div className="text-[10px] text-slate-500">Active allocations</div>
          </div>

          <div className="p-3 rounded-xl bg-[#101522] border border-[#293449]">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tasks Closed</span>
            </div>
            <div className="text-lg font-bold text-slate-100 mt-1">
              {completedTasks.length} / {assignedTasks.length}
            </div>
            <div className="text-[10px] text-slate-500">Lifetime total</div>
          </div>
        </div>

        {/* Contact info bar */}
        <div className="p-3.5 rounded-xl bg-[#101522] border border-[#293449] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-slate-500" />
            <a href={`mailto:${employee.email}`} className="text-purple-400 hover:underline">
              {employee.email}
            </a>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-slate-500" />
              <span>{employee.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-slate-500" />
            <span>{employee.location}</span>
          </div>
        </div>

        {/* Assigned Projects */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Assigned Initiatives ({assignedProjects.length})
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {assignedProjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No active projects assigned.</p>
            ) : (
              assignedProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#101522] border border-[#293449]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      {p.key}
                    </span>
                    <span className="text-xs font-medium text-slate-200 truncate">{p.title}</span>
                  </div>
                  <StatusBadge status={p.status} size="xs" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assigned Tasks */}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Assigned Sprint Tasks ({assignedTasks.length})
          </h4>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {assignedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No tasks assigned currently.</p>
            ) : (
              assignedTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#101522] border border-[#293449]"
                >
                  <span className="text-xs text-slate-200 truncate max-w-xs">{t.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={t.priority} size="xs" />
                    <StatusBadge status={t.status} size="xs" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
