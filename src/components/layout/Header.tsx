import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Building2,
  ChevronDown,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    user,
    org,
    preferences,
    updatePreferences,
    unreadNotificationsCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSearchOpen,
    setQuickActionOpen,
  } = useNexus();

  const location = useLocation();
  const navigate = useNavigate();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const orgRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (orgRef.current && !orgRef.current.contains(e.target as Node)) {
        setOrgDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Operations Overview';
    if (path.startsWith('/analytics')) return 'Operational Analytics';
    if (path.startsWith('/projects')) return 'Project Governance';
    if (path.startsWith('/tasks')) return 'Task Management';
    if (path.startsWith('/calendar')) return 'Operational Schedule';
    if (path.startsWith('/team')) return 'Team Directory';
    if (path.startsWith('/intelligence')) return 'AI Intelligence Core';
    if (path.startsWith('/reports')) return 'Reports & Audits';
    if (path.startsWith('/notifications')) return 'Notification Center';
    if (path.startsWith('/settings')) return 'Organization Settings';
    return 'Dashboard';
  };

  const toggleTheme = () => {
    updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' });
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#293449] bg-[#090b14]/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-sm">
          <Link to="/" className="text-slate-400 hover:text-slate-200 transition-colors hidden sm:inline">
            NEXUS
          </Link>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="font-semibold text-slate-100">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Middle: Global Search bar trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-[#293449] bg-[#151c2c]/70 hover:bg-[#1c2638] text-slate-400 hover:text-slate-200 text-xs transition-all shadow-inner group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            <span>Search projects, tasks, team, analytics...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#101522] border border-[#293449] text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile search icon */}
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Open search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Organization switcher */}
        <div className="relative hidden xl:block" ref={orgRef}>
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#293449] bg-[#151c2c]/80 text-xs font-medium text-slate-200 hover:border-slate-500 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="max-w-[120px] truncate">{org.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {orgDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#293449] bg-[#151c2c] p-2 shadow-2xl z-50">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Active Organization
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300">
                <span className="truncate">{org.name}</span>
                <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              </div>
              <div className="mt-2 pt-2 border-t border-[#293449]">
                <button
                  onClick={() => {
                    navigate('/settings');
                    setOrgDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-between"
                >
                  <span>Manage Organization</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={preferences.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          {preferences.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-purple-400" />
          )}
        </button>

        {/* Quick Action Button */}
        <button
          onClick={() => setQuickActionOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium shadow-sm shadow-purple-500/20 transition-all border border-purple-400/30"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Action</span>
        </button>

        {/* Notification center dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#090b14]" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#293449] bg-[#151c2c] shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#293449] bg-[#101522]/70">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200">Notifications</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {unreadNotificationsCount} new
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#293449]/50">
                {recentNotifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  recentNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setNotifDropdownOpen(false);
                        }
                      }}
                      className={`p-3.5 cursor-pointer transition-colors hover:bg-slate-800/60 ${
                        !notif.read ? 'bg-purple-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-slate-200 line-clamp-1">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1.5 block">{notif.timestamp}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-[#293449] bg-[#101522]/80 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View all operational alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User avatar link to profile/settings */}
        <Link
          to="/settings"
          className="relative group p-0.5 rounded-full ring-1 ring-slate-700 hover:ring-purple-500 transition-all"
          title={`${user.name} (${user.role})`}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
};
