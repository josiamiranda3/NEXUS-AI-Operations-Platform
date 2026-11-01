import React, { useState, useMemo } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EventCreateModal } from '../../components/modals/EventCreateModal';
import { EventDetailModal } from '../../components/modals/EventDetailModal';
import { CalendarEvent } from '../../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  FolderGit2,
} from 'lucide-react';

export const CalendarPage: React.FC = () => {
  const { events, projects, tasks } = useNexus();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // November 2026
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDateForCreate, setSelectedDateForCreate] = useState('2026-11-15');

  // Days in month calculation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Month navigation
  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const setToday = () => {
    setCurrentDate(new Date(2026, 10, 1));
  };

  // Color mapping
  const getEventClass = (cat: string) => {
    switch (cat) {
      case 'project_deadline':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'task_deadline':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30';
      case 'milestone':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'review':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30';
      case 'meeting':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
    }
  };

  // Build grid days for Month view
  const calendarCells = useMemo(() => {
    const cells = [];
    // Padding from prev month
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dayNumber: null, dateString: '' });
    }
    // Days of current month
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      cells.push({ dayNumber: d, dateString: dateStr });
    }
    return cells;
  }, [year, month, daysInMonth, firstDayIndex]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Operational Calendar & Milestones
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Coordinate release dates, sprint steering reviews, and compliance walkthroughs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View switcher */}
          <div className="flex items-center rounded-xl bg-[#151c2c] p-1 border border-[#293449]">
            {(['month', 'week', 'day'] as const).map((vm) => (
              <button
                key={vm}
                onClick={() => setViewMode(vm)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                  viewMode === vm ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {vm}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedDateForCreate(`${year}-${String(month + 1).padStart(2, '0')}-15`);
              setCreateModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Event
          </Button>
        </div>
      </div>

      {/* Navigation & Category Legend Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-100">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1 rounded-lg bg-[#101522] border border-[#293449] p-0.5">
              <button
                onClick={prevPeriod}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Previous period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={setToday}
                className="px-2 py-0.5 text-xs text-slate-300 hover:text-white font-medium"
              >
                Today
              </button>
              <button
                onClick={nextPeriod}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Next period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Color Legend */}
          <div className="flex items-center gap-3 flex-wrap text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              Project Hard Deadline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Task Deadline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Milestone
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              Meeting / Sync
            </span>
          </div>
        </div>
      </Card>

      {/* Monthly View */}
      {viewMode === 'month' && (
        <Card className="overflow-hidden">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-[#293449] bg-[#101522] text-center text-xs font-semibold text-slate-400 py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#293449]/50 bg-[#151c2c]/40">
            {calendarCells.map((cell, idx) => {
              if (!cell.dayNumber) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[110px] p-2 bg-[#0d121f]/40 opacity-40"
                  />
                );
              }

              const dayEvents = events.filter((e) => e.date === cell.dateString);

              return (
                <div
                  key={cell.dateString}
                  onClick={() => {
                    setSelectedDateForCreate(cell.dateString);
                    setCreateModalOpen(true);
                  }}
                  className="min-h-[110px] p-2 hover:bg-slate-800/30 transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold ${
                        cell.dayNumber === 1
                          ? 'w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center'
                          : 'text-slate-300'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-purple-400 transition-opacity">
                      + Add
                    </span>
                  </div>

                  {/* Day Events */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px]">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                          setDetailModalOpen(true);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-medium border truncate transition-all ${getEventClass(
                          ev.category
                        )}`}
                        title={`${ev.title} (${ev.startTime})`}
                      >
                        {ev.startTime} {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Week / Day View simple breakdown */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <Card className="p-6">
          <h3 className="text-base font-bold text-slate-100 mb-4">
            Scheduled Events for this period
          </h3>
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-sm text-slate-400">No scheduled events for this timeframe.</p>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    setSelectedEvent(ev);
                    setDetailModalOpen(true);
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${getEventClass(
                    ev.category
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold">{ev.title}</div>
                      <div className="text-xs opacity-80 mt-0.5">
                        {ev.date} • {ev.startTime} - {ev.endTime} {ev.location && `• ${ev.location}`}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/20">
                    {ev.category.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      )}

      {/* Modals */}
      <EventCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultDate={selectedDateForCreate}
      />
      <EventDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};
