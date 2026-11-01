import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { ProjectCreateModal } from '../../components/modals/ProjectCreateModal';
import { ProjectEditModal } from '../../components/modals/ProjectEditModal';
import { ProjectDetailModal } from '../../components/modals/ProjectDetailModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Project, ProjectStatus, PriorityLevel, Department } from '../../types';
import {
  FolderPlus,
  LayoutGrid,
  Table as TableIcon,
  Columns3,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { projects, deleteProject, employees } = useNexus();
  const [searchParams] = useSearchParams();

  // Visualization mode
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'kanban'>('grid');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'budget' | 'progress' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Auto-open detail if query param exists
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const target = projects.find((p) => p.id === id);
      if (target) {
        setSelectedProject(target);
        setDetailModalOpen(true);
      }
    }
  }, [searchParams, projects]);

  // Filter & Sort
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (statusFilter !== 'All' && p.status !== statusFilter) return false;
        if (priorityFilter !== 'All' && p.priority !== priorityFilter) return false;
        if (departmentFilter !== 'All' && p.department !== departmentFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            p.title.toLowerCase().includes(q) ||
            p.key.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matches) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy];
        let valB: any = b[sortBy];
        if (sortBy === 'dueDate') {
          valA = new Date(a.dueDate).getTime();
          valB = new Date(b.dueDate).getTime();
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [projects, statusFilter, priorityFilter, departmentFilter, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  // Kanban lanes
  const kanbanLanes: ProjectStatus[] = ['Planning', 'In Progress', 'On Hold', 'Completed'];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Project Governance & Portfolio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track multi-team delivery, resource utilization, and milestone health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View switcher */}
          <div className="flex items-center rounded-xl bg-[#151c2c] p-1 border border-[#293449]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Data Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Columns3 className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<FolderPlus className="w-4 h-4" />}
          >
            New Project
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, key, tags, or description..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="DevOps">DevOps</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Security">Security</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Operations">Operations</option>
            </select>

            {/* Sort Filter */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('-');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="budget-desc">Budget (Highest)</option>
              <option value="progress-desc">Progress (Highest)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Main Content Render based on View Mode */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects match criteria"
          description="Try adjusting your search queries or active status and department filters."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('All');
            setPriorityFilter('All');
            setDepartmentFilter('All');
          }}
        />
      ) : viewMode === 'grid' ? (
        // 1. Grid View
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {paginatedProjects.map((p) => {
              const lead = employees.find((e) => e.id === p.leadId);
              return (
                <Card
                  key={p.id}
                  hover
                  className="flex flex-col justify-between p-4"
                  onClick={() => {
                    setSelectedProject(p);
                    setDetailModalOpen(true);
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {p.key}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <PriorityBadge priority={p.priority} size="xs" />
                        <StatusBadge status={p.status} size="xs" />
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 mt-2.5 line-clamp-1 group-hover:text-purple-300">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#293449]/80 space-y-3">
                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="font-semibold text-purple-300">{p.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Metadata footer */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        <span>${(p.budget / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{p.dueDate}</span>
                      </div>
                      {lead && (
                        <img
                          src={lead.avatar}
                          alt={lead.name}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-purple-500/30"
                          title={`Lead: ${lead.name}`}
                        />
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 text-xs text-slate-400">
              <span>
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredProjects.length)} of{' '}
                {filteredProjects.length} initiatives
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : viewMode === 'table' ? (
        // 2. Data Table View
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101522] border-b border-[#293449] text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Initiative</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Target Due</th>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#293449]/50 text-slate-200">
                {paginatedProjects.map((p) => {
                  const lead = employees.find((e) => e.id === p.leadId);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedProject(p);
                        setDetailModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {p.key}
                          </span>
                          <span className="max-w-[200px] truncate">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{p.department}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} size="xs" />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={p.priority} size="xs" />
                      </td>
                      <td className="px-4 py-3 font-mono">
                        ${p.budget.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-purple-500 rounded-full"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-300">
                            {p.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{p.dueDate}</td>
                      <td className="px-4 py-3">
                        {lead && (
                          <div className="flex items-center gap-1.5">
                            <img
                              src={lead.avatar}
                              alt={lead.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="truncate max-w-[100px]">{lead.name}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setDetailModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                            title="Inspect"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setEditModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-purple-300 hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(p);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        // 3. Kanban Board View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
          {kanbanLanes.map((lane) => {
            const laneProjects = filteredProjects.filter((p) => p.status === lane);
            return (
              <div
                key={lane}
                className="rounded-2xl border border-[#293449] bg-[#101522]/70 p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{lane}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400">
                      {laneProjects.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setCreateModalOpen(true)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    +
                  </Button>
                </div>

                <div className="space-y-2.5 min-h-[300px]">
                  {laneProjects.map((p) => {
                    const lead = employees.find((e) => e.id === p.leadId);
                    return (
                      <Card
                        key={p.id}
                        hover
                        onClick={() => {
                          setSelectedProject(p);
                          setDetailModalOpen(true);
                        }}
                        className="p-3 bg-[#151c2c] border border-[#293449]"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {p.key}
                          </span>
                          <PriorityBadge priority={p.priority} size="xs" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-100 mt-2 line-clamp-1">
                          {p.title}
                        </h4>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                          <span>{p.dueDate}</span>
                          <span className="text-purple-300 font-semibold">{p.progress}%</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ProjectCreateModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <ProjectEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={selectedProject}
      />
      <ProjectDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        project={selectedProject}
        onEdit={(proj) => {
          setSelectedProject(proj);
          setEditModalOpen(true);
        }}
        onDelete={(proj) => {
          setSelectedProject(proj);
          setDeleteConfirmOpen(true);
        }}
      />
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Project Initiative"
        message={`Are you sure you want to delete "${selectedProject?.title}"? All associated tasks and milestones will be permanently removed.`}
        confirmLabel="Delete Initiative"
        onConfirm={() => {
          if (selectedProject) {
            deleteProject(selectedProject.id);
          }
        }}
      />
    </div>
  );
};
