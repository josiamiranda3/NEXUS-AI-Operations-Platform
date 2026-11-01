import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PriorityLevel, TaskStatus } from '../../types';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
}

export const TaskCreateModal: React.FC<TaskCreateModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
  defaultStatus = 'To Do',
}) => {
  const { addTask, projects, employees } = useNexus();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [assigneeId, setAssigneeId] = useState(employees[0]?.id || '');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [estimatedHours, setEstimatedHours] = useState(16);
  const [tagsInput, setTagsInput] = useState('DevOps, Kubernetes');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addTask({
      title,
      description,
      projectId: projectId || projects[0]?.id,
      assigneeId: assigneeId || employees[0]?.id,
      priority,
      status,
      dueDate,
      estimatedHours: Number(estimatedHours),
      spentHours: 0,
      tags,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Operational Task"
      description="Assign to an engineer, associate with an initiative, and establish deadline."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} type="submit">
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Task Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Audit cross-cluster latency between us-east1 and eu-central1"
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Acceptance Criteria</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed instructions, metrics, benchmarks..."
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Initiative</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assigned Owner</label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status Lane</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="Backlog">Backlog</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Estimated Hours</label>
            <input
              type="number"
              min={1}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="DevOps, SRE, Postgres"
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
