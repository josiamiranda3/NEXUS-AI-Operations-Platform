import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  FolderPlus,
  CheckSquare,
  UserPlus,
  CalendarPlus,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ProjectCreateModal } from '../modals/ProjectCreateModal';
import { TaskCreateModal } from '../modals/TaskCreateModal';
import { EmployeeCreateModal } from '../modals/EmployeeCreateModal';
import { EventCreateModal } from '../modals/EventCreateModal';

export const QuickActionModal: React.FC = () => {
  const { quickActionOpen, setQuickActionOpen } = useNexus();
  const navigate = useNavigate();

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const actions = [
    {
      title: 'Create Project',
      description: 'Initialize a new initiative with budget, milestones, and lead.',
      icon: FolderPlus,
      color: 'from-purple-600 to-indigo-600',
      action: () => {
        setQuickActionOpen(false);
        setProjectModalOpen(true);
      },
    },
    {
      title: 'Create Task',
      description: 'Log an operational task, assign an owner, and set priority.',
      icon: CheckSquare,
      color: 'from-cyan-600 to-blue-600',
      action: () => {
        setQuickActionOpen(false);
        setTaskModalOpen(true);
      },
    },
    {
      title: 'Add Team Member',
      description: 'Onboard an engineer, designer, or operations manager.',
      icon: UserPlus,
      color: 'from-emerald-600 to-teal-600',
      action: () => {
        setQuickActionOpen(false);
        setEmployeeModalOpen(true);
      },
    },
    {
      title: 'Schedule Operational Event',
      description: 'Book a sprint steering, code freeze, or auditor review.',
      icon: CalendarPlus,
      color: 'from-amber-600 to-orange-600',
      action: () => {
        setQuickActionOpen(false);
        setEventModalOpen(true);
      },
    },
    {
      title: 'Consult AI Intelligence',
      description: 'Ask Nexus AI to diagnose bottlenecks or generate forecasts.',
      icon: Sparkles,
      color: 'from-purple-600 to-pink-600',
      action: () => {
        setQuickActionOpen(false);
        navigate('/intelligence');
      },
    },
  ];

  return (
    <>
      <Modal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
        title="Quick Operations Launcher"
        description="Select an operational action to initialize immediately across Nexus."
        size="md"
      >
        <div className="grid grid-cols-1 gap-2.5">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.title}
                onClick={act.action}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#293449] bg-[#101522]/60 hover:bg-[#1c2638] hover:border-slate-500 text-left transition-all duration-150 group"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${act.color} flex items-center justify-center text-white shrink-0 shadow-md`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                      {act.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">{act.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-transform group-hover:translate-x-1" />
              </button>
            );
          })}
        </div>
      </Modal>

      {/* Sub-modals triggered by Quick Actions */}
      <ProjectCreateModal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} />
      <TaskCreateModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
      <EmployeeCreateModal isOpen={employeeModalOpen} onClose={() => setEmployeeModalOpen(false)} />
      <EventCreateModal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} />
    </>
  );
};
