import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import {
  LayoutDashboard,
  BarChart3,
  FolderGit2,
  CheckSquare,
  CalendarDays,
  Users2,
  Sparkles,
  FileSpreadsheet,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { unreadNotificationsCount, org, user } = useNexus();
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/', icon: LayoutDashboard },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Calendar', path: '/calendar', icon: CalendarDays },
    { label: 'Team', path: '/team', icon: Users2 },
    {
      label: 'AI Intelligence',
      path: '/intelligence',
      icon: Sparkles,
      highlight: true,
    },
    { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-[#293449] bg-[#0d121f] transition-all duration-300 ease-in-out lg:static ${
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header / Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#293449]/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                  NEXUS
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    AI OPS
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 truncate">{org.name}</span>
              </div>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/' || location.pathname === '/dashboard'
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive
                      ? 'text-purple-400'
                      : item.highlight
                      ? 'text-cyan-400 group-hover:text-cyan-300'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {/* AI pill indicator */}
                {item.highlight && (!collapsed || mobileOpen) && (
                  <span className="px-1.5 py-0.5 text-[10px] uppercase font-semibold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    v3.8
                  </span>
                )}

                {/* Badge count */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`inline-flex items-center justify-center font-bold rounded-full ${
                      collapsed && !mobileOpen
                        ? 'absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500'
                        : 'px-2 py-0.5 text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {(!collapsed || mobileOpen) && item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Operational Security Badge */}
        {(!collapsed || mobileOpen) && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-[#151c2c] border border-[#293449] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">SOC2 Type II Active</div>
              <div className="text-[11px] text-slate-400 truncate">Zero-trust verified</div>
            </div>
          </div>
        )}

        {/* User preview profile footer */}
        <div className="p-3 border-t border-[#293449]/80">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
              collapsed && !mobileOpen ? 'justify-center' : 'hover:bg-slate-800/60'
            }`}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-500/40 shrink-0"
            />
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-100 truncate">{user.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{user.title}</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
