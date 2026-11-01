import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import {
  TrendingUp,
  FolderGit2,
  CheckCircle2,
  Users2,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  DollarSign,
  Activity,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, projects, tasks, employees, activities, setQuickActionOpen } = useNexus();
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');

  // Compute live KPI metrics
  const activeProjectsCount = projects.filter((p) => p.status === 'In Progress').length;
  const completedTasksCount = tasks.filter((t) => t.status === 'Done').length;
  const totalTasksCount = tasks.length;
  const avgProductivity =
    employees.length > 0
      ? Math.round(
          employees.reduce((acc, emp) => acc + emp.productivityScore, 0) / employees.length
        )
      : 94;

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  // Revenue chart data responding to date filter
  const revenueData = useMemo(() => {
    if (dateRange === '7d') {
      return [
        { name: 'Mon', revenue: 168000, target: 150000 },
        { name: 'Tue', revenue: 182000, target: 160000 },
        { name: 'Wed', revenue: 195000, target: 170000 },
        { name: 'Thu', revenue: 210000, target: 175000 },
        { name: 'Fri', revenue: 235000, target: 180000 },
        { name: 'Sat', revenue: 220000, target: 180000 },
        { name: 'Sun', revenue: 245000, target: 190000 },
      ];
    }
    if (dateRange === '90d') {
      return [
        { name: 'Aug', revenue: 890000, target: 820000 },
        { name: 'Sep', revenue: 1040000, target: 950000 },
        { name: 'Oct', revenue: 1284500, target: 1100000 },
      ];
    }
    // 30d default
    return [
      { name: 'Week 1', revenue: 240000, target: 210000 },
      { name: 'Week 2', revenue: 295000, target: 260000 },
      { name: 'Week 3', revenue: 340000, target: 300000 },
      { name: 'Week 4', revenue: 409500, target: 350000 },
    ];
  }, [dateRange]);

  // Department efficiency breakdown
  const departmentData = useMemo(() => {
    const deptCounts: Record<string, number> = {};
    projects.forEach((p) => {
      deptCounts[p.department] = (deptCounts[p.department] || 0) + 1;
    });
    return Object.entries(deptCounts).map(([dept, count]) => ({
      name: dept,
      projects: count,
      velocity: Math.floor(Math.random() * 20) + 80,
    }));
  }, [projects]);

  // Project status pie data
  const statusDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      'In Progress': 0,
      Planning: 0,
      'On Hold': 0,
      Completed: 0,
    };
    projects.forEach((p) => {
      if (counts[p.status] !== undefined) {
        counts[p.status] += 1;
      }
    });
    return [
      { name: 'In Progress', value: counts['In Progress'], color: '#8b5cf6' },
      { name: 'Completed', value: counts['Completed'], color: '#10b981' },
      { name: 'Planning', value: counts['Planning'], color: '#f59e0b' },
      { name: 'On Hold', value: counts['On Hold'], color: '#64748b' },
    ];
  }, [projects]);

  // Upcoming deadlines (next 7 days)
  const upcomingProjects = useMemo(() => {
    return [...projects]
      .filter((p) => p.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 4);
  }, [projects]);

  // High-risk alerts
  const criticalAlerts = useMemo(() => {
    return projects.filter((p) => p.riskLevel === 'High');
  }, [projects]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Greeting & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Good morning, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here is your organization's real-time operational overview.
          </p>
        </div>

        {/* Date Filter & Quick Action */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center rounded-xl bg-[#151c2c] p-1 border border-[#293449]">
            {(['7d', '30d', '90d', 'custom'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  dateRange === r
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : 'Custom'}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuickActionOpen(true)}
            icon={<Zap className="w-3.5 h-3.5" />}
          >
            Launch Action
          </Button>
        </div>
      </div>

      {/* AI Operational Insights Alert Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#151c2c] to-cyan-950/40 p-4 sm:p-5 backdrop-blur-md shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  NEXUS Operational Intelligence Core
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Real-time
                </span>
              </div>
              <p className="text-sm text-slate-200 mt-1 font-medium">
                Team velocity surged 14% this sprint. 2 high-risk project bottlenecks require review before Friday code freeze.
              </p>
            </div>
          </div>
          <Button
            variant="cyan"
            size="sm"
            onClick={() => navigate('/intelligence')}
            icon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0"
          >
            Diagnose With AI
          </Button>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* KPI 1: Revenue */}
        <Card className="p-4 relative overflow-hidden" hover>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">$1,284,500</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4%</span>
            <span className="text-slate-500 font-normal">vs prev {dateRange}</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
          </div>
        </Card>

        {/* KPI 2: Active Projects */}
        <Card className="p-4 relative overflow-hidden" hover onClick={() => navigate('/projects')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">{activeProjectsCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-purple-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+2</span>
            <span className="text-slate-500 font-normal">new this month</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full"
              style={{ width: `${Math.round((activeProjectsCount / (projects.length || 1)) * 100)}%` }}
            />
          </div>
        </Card>

        {/* KPI 3: Tasks Completed */}
        <Card className="p-4 relative overflow-hidden" hover onClick={() => navigate('/tasks')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tasks Completed</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">
            {completedTasksCount} <span className="text-xs text-slate-500 font-normal">/ {totalTasksCount}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-cyan-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2%</span>
            <span className="text-slate-500 font-normal">completion rate</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full"
              style={{ width: `${Math.round((completedTasksCount / (totalTasksCount || 1)) * 100)}%` }}
            />
          </div>
        </Card>

        {/* KPI 4: Team Productivity */}
        <Card className="p-4 relative overflow-hidden" hover onClick={() => navigate('/team')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Team Productivity</span>
            <Users2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">{avgProductivity}%</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+3.8%</span>
            <span className="text-slate-500 font-normal">above target</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${avgProductivity}%` }} />
          </div>
        </Card>

        {/* KPI 5: Operational Efficiency */}
        <Card className="p-4 relative overflow-hidden" hover onClick={() => navigate('/analytics')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Op. Efficiency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">91.6%</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.5%</span>
            <span className="text-slate-500 font-normal">SLA adherence</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '91.6%' }} />
          </div>
        </Card>

        {/* KPI 6: Monthly Growth */}
        <Card className="p-4 relative overflow-hidden" hover onClick={() => navigate('/reports')}>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monthly Growth</span>
            <TrendingUp className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 mt-2">+22.8%</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>YoY</span>
            <span className="text-slate-500 font-normal">ARR index</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full" style={{ width: '78%' }} />
          </div>
        </Card>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue & Burn vs Target AreaChart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Operational Revenue & Financial Velocity"
            subtitle={`Aggregated financials across active client engagements (${dateRange})`}
            action={
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  Actual Revenue
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  Target Plan
                </span>
              </div>
            }
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#293449" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151c2c',
                      borderColor: '#293449',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Actual Revenue"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    name="Target Plan"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#targetGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Project Status Distribution */}
        <Card>
          <CardHeader
            title="Portfolio Status Health"
            subtitle={`${projects.length} Total Enterprise Initiatives`}
          />
          <CardContent>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#151c2c" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151c2c',
                      borderColor: '#293449',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-[#293449]">
              {statusDistribution.map((st) => (
                <div key={st.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                    <span className="text-slate-300">{st.name}</span>
                  </div>
                  <span className="font-semibold text-slate-100">{st.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Visualizations & Operational Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Initiatives BarChart */}
        <Card>
          <CardHeader
            title="Department Allocation"
            subtitle="Initiatives distribution & team velocity"
          />
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#293449" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151c2c',
                      borderColor: '#293449',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="projects" name="Projects" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Critical Deadlines */}
        <Card>
          <CardHeader
            title="Upcoming Critical Deadlines"
            subtitle="Prioritized delivery schedule"
            action={
              <button
                onClick={() => navigate('/calendar')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium"
              >
                Calendar →
              </button>
            }
          />
          <CardContent className="space-y-3">
            {upcomingProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects?id=${p.id}`)}
                className="p-3 rounded-xl bg-[#101522] border border-[#293449] hover:border-slate-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 truncate max-w-[180px]">
                    [{p.key}] {p.title}
                  </span>
                  <PriorityBadge priority={p.priority} size="xs" />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Target: {p.dueDate}</span>
                  </div>
                  <span className="font-semibold text-purple-300">{p.progress}% done</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities Feed */}
        <Card>
          <CardHeader
            title="Real-Time Activity Feed"
            subtitle="Audit log of operational actions"
          />
          <CardContent className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <img
                  src={act.user.avatar}
                  alt={act.user.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {act.title}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{act.description}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts & Governance Block if any exist */}
      {criticalAlerts.length > 0 && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-rose-300">
                  {criticalAlerts.length} Projects Flagged With High Operational Risk
                </h4>
                <p className="text-xs text-rose-200/70 mt-0.5">
                  Dependencies on external compliance or resource bottlenecks require management intervention:
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={() => navigate('/projects')}
              className="border-rose-500/40 text-rose-300 hover:bg-rose-900/30"
            >
              Review Projects
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-rose-500/20">
            {criticalAlerts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#151c2c] border border-[#293449] text-xs"
              >
                <span className="text-slate-200 font-medium truncate">
                  [{p.key}] {p.title}
                </span>
                <span className="text-rose-400 font-semibold shrink-0">Due: {p.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
