import React from 'react';
import { useNexus } from '../../context/NexusContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CalendarEvent } from '../../types';
import { Calendar, Clock, MapPin, FolderGit2, Trash2 } from 'lucide-react';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  const { deleteEvent, projects } = useNexus();

  if (!event) return null;

  const project = projects.find((p) => p.id === event.relatedEntityId);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'project_deadline':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'task_deadline':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'milestone':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'review':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'meeting':
      default:
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={event.title}
      description={
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs border font-medium mt-1 ${getCategoryColor(
            event.category
          )}`}
        >
          {event.category.replace('_', ' ').toUpperCase()}
        </span>
      }
      footer={
        <div className="w-full flex items-center justify-between">
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => {
              deleteEvent(event.id);
              onClose();
            }}
          >
            Delete Event
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {event.description && (
          <p className="text-sm text-slate-300 leading-relaxed bg-[#101522] p-3 rounded-xl border border-[#293449]">
            {event.description}
          </p>
        )}

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-200">Date:</span>
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">Time:</span>
            <span>
              {event.startTime} - {event.endTime}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Location:</span>
              <span>{event.location}</span>
            </div>
          )}

          {project && (
            <div className="flex items-center gap-2.5 text-slate-300">
              <FolderGit2 className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-slate-200">Associated Initiative:</span>
              <span className="text-purple-300">
                [{project.key}] {project.title}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
