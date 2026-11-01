import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { EmployeeCreateModal } from '../../components/modals/EmployeeCreateModal';
import { EmployeeEditModal } from '../../components/modals/EmployeeEditModal';
import { EmployeeDetailModal } from '../../components/modals/EmployeeDetailModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { Employee, Department } from '../../types';
import {
  Users2,
  UserPlus,
  Search,
  Filter,
  Mail,
  MapPin,
  TrendingUp,
  FolderGit2,
  CheckCircle2,
  Edit2,
  Trash2,
  Eye,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { employees, projects, tasks, deleteEmployee } = useNexus();
  const [searchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Auto-open if query param exists
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const target = employees.find((e) => e.id === id);
      if (target) {
        setSelectedEmployee(target);
        setDetailModalOpen(true);
      }
    }
  }, [searchParams, employees]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      if (departmentFilter !== 'All' && e.department !== departmentFilter) return false;
      if (statusFilter !== 'All' && e.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [employees, departmentFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Team Directory & Talent Governance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage engineering talent, capacity allocation, and productivity indexes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-[#151c2c] p-1 border border-[#293449]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Card Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            icon={<UserPlus className="w-4 h-4" />}
          >
            Add Member
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members by name, position, or department..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
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

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Busy">Busy</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Member Cards / Table */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          title="No team members found"
          description="Try broadening your search or department filter."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setDepartmentFilter('All');
            setStatusFilter('All');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => {
            const memberProjects = projects.filter(
              (p) => p.leadId === emp.id || p.memberIds.includes(emp.id)
            );
            const memberTasks = tasks.filter((t) => t.assigneeId === emp.id);

            return (
              <Card
                key={emp.id}
                hover
                onClick={() => {
                  setSelectedEmployee(emp);
                  setDetailModalOpen(true);
                }}
                className="p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-100 truncate group-hover:text-purple-300 transition-colors">
                          {emp.name}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">{emp.role}</p>
                        <span className="text-[11px] font-semibold text-purple-400">
                          {emp.department}
                        </span>
                      </div>
                    </div>

                    <Badge
                      variant={
                        emp.status === 'Active'
                          ? 'success'
                          : emp.status === 'Busy'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="xs"
                      dot
                    >
                      {emp.status}
                    </Badge>
                  </div>

                  {/* Location & email */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{emp.location}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Capacity Footer */}
                <div className="mt-5 pt-3.5 border-t border-[#293449]/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-slate-400">Score:</span>
                    <strong className="text-purple-300 font-bold">{emp.productivityScore}%</strong>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{memberProjects.length} Projects</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{memberTasks.length} Tasks</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101522] border-b border-[#293449] text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Productivity</th>
                  <th className="px-4 py-3">Projects</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#293449]/50 text-slate-200">
                {filteredEmployees.map((emp) => {
                  const memberProjects = projects.filter(
                    (p) => p.leadId === emp.id || p.memberIds.includes(emp.id)
                  );
                  return (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setDetailModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500/30"
                          />
                          <div>
                            <div className="font-semibold text-slate-100">{emp.name}</div>
                            <div className="text-[11px] text-slate-400">{emp.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-purple-300">{emp.department}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            emp.status === 'Active'
                              ? 'success'
                              : emp.status === 'Busy'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="xs"
                          dot
                        >
                          {emp.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{emp.location}</td>
                      <td className="px-4 py-3">
                        <strong className="text-purple-300 font-bold">{emp.productivityScore}%</strong>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{memberProjects.length} allocated</td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setDetailModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setEditModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-purple-300 hover:bg-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800"
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
      )}

      {/* Modals */}
      <EmployeeCreateModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} />
      <EmployeeEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        employee={selectedEmployee}
      />
      <EmployeeDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        employee={selectedEmployee}
        onEdit={(emp) => {
          setSelectedEmployee(emp);
          setEditModalOpen(true);
        }}
        onDelete={(emp) => {
          setSelectedEmployee(emp);
          setDeleteConfirmOpen(true);
        }}
      />
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${selectedEmployee?.name} from Nexus directory? Any lead assignments will need reassignment.`}
        confirmLabel="Remove Member"
        onConfirm={() => {
          if (selectedEmployee) {
            deleteEmployee(selectedEmployee.id);
          }
        }}
      />
    </div>
  );
};
