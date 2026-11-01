import React, { useState, useEffect } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Task, PriorityLevel, TaskStatus } from '../../types';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({ isOpen, onClose, task }) => {
  const { updateTask, projects, employees } = useNexus();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(10);
  const [spentHours, setSpentHours] = useState(0);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setProjectId(task.projectId);
      setAssigneeId(task.assigneeId);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate);
      setEstimatedHours(task.estimatedHours);
      setSpentHours(task.spentHours);
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask(task.id, {
      title,
      description,
      projectId,
      assigneeId,
      priority,
      status,
      dueDate,
      estimatedHours: Number(estimatedHours),
      spentHours: Number(spentHours),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task Details"
      description="Update assignee, status, time spent, or priority."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} type="submit">
            Save Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Task Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project</label>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Assignee</label>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status</label>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Est. Hours</label>
            <input
              type="number"
              min={1}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Spent Hours</label>
            <input
              type="number"
              min={0}
              value={spentHours}
              onChange={(e) => setSpentHours(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};
