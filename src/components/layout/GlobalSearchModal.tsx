import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import {
  Search,
  FolderGit2,
  CheckSquare,
  Users2,
  FileSpreadsheet,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../ui/Badge';

export const GlobalSearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, projects, tasks, employees } = useNexus();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        projects: projects.slice(0, 3),
        tasks: tasks.slice(0, 3),
        employees: employees.slice(0, 3),
      };
    }

    const q = query.toLowerCase().trim();

    const matchedProjects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.department.toLowerCase().includes(q)
    );

    const matchedTasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );

    const matchedEmployees = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q)
    );

    return {
      projects: matchedProjects,
      tasks: matchedTasks,
      employees: matchedEmployees,
    };
  }, [query, projects, tasks, employees]);

  const flatItems = useMemo(() => {
    const list: Array<{
      type: 'project' | 'task' | 'employee';
      id: string;
      title: string;
      subtitle: string;
      link: string;
      badge?: string;
    }> = [];

    searchResults.projects.forEach((p) => {
      list.push({
        type: 'project',
        id: p.id,
        title: `[${p.key}] ${p.title}`,
        subtitle: `${p.department} • $${p.budget.toLocaleString()} • ${p.status}`,
        link: `/projects?id=${p.id}`,
        badge: p.status,
      });
    });

    searchResults.tasks.forEach((t) => {
      list.push({
        type: 'task',
        id: t.id,
        title: t.title,
        subtitle: `Priority: ${t.priority} • Status: ${t.status} • Due: ${t.dueDate}`,
        link: `/tasks?id=${t.id}`,
        badge: t.priority,
      });
    });

    searchResults.employees.forEach((e) => {
      list.push({
        type: 'employee',
        id: e.id,
        title: e.name,
        subtitle: `${e.role} • ${e.department} • ${e.status}`,
        link: `/team?id=${e.id}`,
        badge: e.department,
      });
    });

    return list;
  }, [searchResults]);

  const handleSelect = (link: string) => {
    setSearchOpen(false);
    navigate(link);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatItems[selectedIndex]) {
        handleSelect(flatItems[selectedIndex].link);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
    }
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setSearchOpen(false)}
      />

      <div
        className="relative w-full max-w-2xl rounded-2xl border border-[#293449] bg-[#151c2c] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#293449] bg-[#101522]/80">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type to search projects, tasks, team members..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 border border-slate-700 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#293449]/30">
          {flatItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No results found for "{query}".
            </div>
          ) : (
            flatItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={`${item.type}-${item.id}`}
                  onClick={() => handleSelect(item.link)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-purple-600/20 border border-purple-500/30' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        item.type === 'project'
                          ? 'bg-purple-500/10 text-purple-400'
                          : item.type === 'task'
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {item.type === 'project' ? (
                        <FolderGit2 className="w-4 h-4" />
                      ) : item.type === 'task' ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Users2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-medium text-slate-100 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-[#293449] bg-[#101522]/90 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXUS Intelligent Index</span>
          </div>
        </div>
      </div>
    </div>
  );
};
