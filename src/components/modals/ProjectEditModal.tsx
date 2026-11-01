import React, { useState, useEffect } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Project, Department, PriorityLevel, ProjectStatus } from '../../types';

interface ProjectEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ProjectEditModal: React.FC<ProjectEditModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { updateProject, employees } = useNexus();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [progress, setProgress] = useState(0);
  const [budget, setBudget] = useState(100000);
  const [spent, setSpent] = useState(50000);
  const [dueDate, setDueDate] = useState('');
  const [leadId, setLeadId] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Moderate' | 'High'>('Low');

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setDepartment(project.department);
      setPriority(project.priority);
      setStatus(project.status);
      setProgress(project.progress);
      setBudget(project.budget);
      setSpent(project.spent);
      setDueDate(project.dueDate);
      setLeadId(project.leadId);
      setRiskLevel(project.riskLevel);
    }
  }, [project]);

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, {
      title,
      description,
      department,
      priority,
      status,
      progress: Number(progress),
      budget: Number(budget),
      spent: Number(spent),
      dueDate,
      leadId,
      riskLevel,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Project: [${project.key}] ${project.title}`}
      description="Update milestones, allocated budget, lead, or health status."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} type="submit">
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Title</label>
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
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Progress ({progress}%)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full mt-2 accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Budget ($ USD)</label>
            <input
              type="number"
              min={0}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Spent ($ USD)</label>
            <input
              type="number"
              min={0}
              step={1000}
              value={spent}
              onChange={(e) => setSpent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Lead</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Risk Level</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as 'Low' | 'Moderate' | 'High')}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="Low">Low Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};
