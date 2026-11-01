import React, { useState } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { EventCategory } from '../../types';

interface EventCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export const EventCreateModal: React.FC<EventCreateModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
}) => {
  const { addEvent, projects } = useNexus();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDate || '2026-11-15');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:00');
  const [category, setCategory] = useState<EventCategory>('meeting');
  const [relatedEntityId, setRelatedEntityId] = useState('');
  const [location, setLocation] = useState('Zoom Operations Bridge / Room 4B');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title,
      description,
      date,
      startTime,
      endTime,
      category,
      relatedEntityId: relatedEntityId || undefined,
      location,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Operational Event"
      description="Book a sprint steering, release gate, code freeze, or compliance audit."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} type="submit">
            Schedule Event
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Event Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Apollo Migration Cutover Gate 2"
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Description & Agenda</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key attendees, topics to cover, sign-off criteria..."
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Start Time</label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">End Time</label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="meeting">Team Meeting</option>
              <option value="milestone">Milestone / Code Freeze</option>
              <option value="review">Sprint / Architecture Review</option>
              <option value="project_deadline">Project Hard Deadline</option>
              <option value="task_deadline">Task Deadline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Related Project</label>
            <select
              value={relatedEntityId}
              onChange={(e) => setRelatedEntityId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            >
              <option value="">None / General</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.key}] {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location / Bridge</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Zoom link or Physical Room"
            className="w-full px-3 py-2 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 focus:outline-none focus:border-purple-500"
          />
        </div>
      </form>
    </Modal>
  );
};
