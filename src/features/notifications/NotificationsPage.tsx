import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NotificationType, NotificationItem } from '../../types';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    unreadNotificationsCount,
  } = useNexus();
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Unread') return !n.read;
      if (activeFilter === 'Tasks') return n.type === 'task_assigned';
      if (activeFilter === 'Deadlines') return n.type === 'deadline_approaching';
      if (activeFilter === 'Alerts') return n.type === 'performance_alert';
      if (activeFilter === 'System') return n.type === 'system';
      return true;
    });
  }, [notifications, activeFilter]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'task_assigned':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      case 'deadline_approaching':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'project_completed':
        return <CheckCheck className="w-4 h-4 text-emerald-400" />;
      case 'performance_alert':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'team_activity':
        return <Users2 className="w-4 h-4 text-purple-400" />;
      case 'system':
      default:
        return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-3">
            Operational Notification Center
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {unreadNotificationsCount} unread
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time critical alarms, project transitions, and sprint assignments.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotificationsRead}
            icon={<CheckCheck className="w-4 h-4" />}
          >
            Mark All As Read
          </Button>
        )}
      </div>

      {/* Filter Chips */}
      <Card className="p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {['All', 'Unread', 'Tasks', 'Deadlines', 'Alerts', 'System'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications List */}
      <Card className="divide-y divide-[#293449]/60 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No notifications matching this filter.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.link) navigate(notif.link);
              }}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-slate-800/40 ${
                !notif.read ? 'bg-purple-950/20 border-l-4 border-l-purple-500' : ''
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-[#101522] border border-[#293449] shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-100">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{notif.message}</p>
                  <span className="text-[11px] text-slate-500 mt-2 block">{notif.timestamp}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div
                className="flex items-center gap-1.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                {notif.link && (
                  <button
                    onClick={() => {
                      markNotificationRead(notif.id);
                      navigate(notif.link!);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                    title="Navigate to resource"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
