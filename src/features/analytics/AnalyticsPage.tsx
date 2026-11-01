import React, { useState, useMemo } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  Zap,
  ShieldCheck,
  FolderGit2,
  Users2,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { projects, tasks, employees, showToast } = useNexus();

  const [timeframe, setTimeframe] = useState<'30d' | '90d' | '1y'>('90d');

  // Compute metrics
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const budgetUtilization = Math.round((totalSpent / (totalBudget || 1)) * 100);

  // Velocity data
  const velocityTrend = [
    { sprint: 'Sprint 19', velocity: 118, committed: 125 },
    { sprint: 'Sprint 20', velocity: 124, committed: 130 },
    { sprint: 'Sprint 21', velocity: 132, committed: 135 },
    { sprint: 'Sprint 22', velocity: 129, committed: 130 },
    { sprint: 'Sprint 23', velocity: 138, committed: 140 },
    { sprint: 'Sprint 24', velocity: 146, committed: 145 },
  ];

  // Financial Burn vs Revenue
  const financialData = [
    { month: 'Jun', revenue: 920000, expenses: 680000, margin: 240000 },
    { month: 'Jul', revenue: 980000, expenses: 710000, margin: 270000 },
    { month: 'Aug', revenue: 1080000, expenses: 740000, margin: 340000 },
    { month: 'Sep', revenue: 1190000, expenses: 780000, margin: 410000 },
    { month: 'Oct', revenue: 1284500, expenses: 810000, margin: 474500 },
  ];

  // Department Productivity & Headcount
  const departmentMetrics = useMemo(() => {
    const deptMap: Record<string, { projects: number; spent: number }> = {};
    projects.forEach((p) => {
      if (!deptMap[p.department]) {
        deptMap[p.department] = { projects: 0, spent: 0 };
      }
      deptMap[p.department].projects += 1;
      deptMap[p.department].spent += p.spent;
    });

    return Object.entries(deptMap).map(([dept, data]) => ({
      name: dept,
      projects: data.projects,
      spend: Math.round(data.spent / 1000),
    }));
  }, [projects]);

  // Project Risk Matrix counts
  const riskCounts = useMemo(() => {
    return [
      { name: 'Low Risk', value: projects.filter((p) => p.riskLevel === 'Low').length, color: '#10b981' },
      { name: 'Moderate Risk', value: projects.filter((p) => p.riskLevel === 'Moderate').length, color: '#f59e0b' },
      { name: 'High Risk', value: projects.filter((p) => p.riskLevel === 'High').length, color: '#ef4444' },
    ];
  }, [projects]);

  // Export CSV functionality
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Project Key,Title,Department,Status,Priority,Budget,Spent,Progress,Due Date\n';

    projects.forEach((p) => {
      csvContent += `"${p.key}","${p.title}","${p.department}","${p.status}","${p.priority}",${p.budget},${p.spent},${p.progress}%,"${p.dueDate}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nexus_Operations_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics summary exported to CSV', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Operational Analytics & Intelligence
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Deep financial run-rates, sprint velocity regressions, and resource health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl bg-[#151c2c] p-1 border border-[#293449]">
            {(['30d', '90d', '1y'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === t ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === '30d' ? 'Last 30 Days' : t === '90d' ? 'Quarter (90d)' : 'Full Year'}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Portfolio Spend Ratio</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">
            ${(totalSpent / 1000).toFixed(0)}k <span className="text-xs text-slate-500 font-normal">/ ${(totalBudget / 1000).toFixed(0)}k</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">
            {budgetUtilization}% consumed (Within 4.5% tolerance)
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current Sprint Velocity</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 mt-2">146 pts</div>
          <div className="text-xs text-emerald-400 mt-1 font-medium">
            +5.8% above commitment
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Time to Resolution</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">1.8 days</div>
          <div className="text-xs text-cyan-400 mt-1 font-medium">
            -26% down vs Q2 baseline
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Compliance Integrity</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 mt-2">99.4%</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            SOC2 continuous audit clean
          </div>
        </Card>
      </div>

      {/* Main Charts: Financial Run-Rate & Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Revenue vs Expenses */}
        <Card>
          <CardHeader
            title="Revenue Run-Rate vs Operational Burn"
            subtitle="Trailing 5 months financials in USD"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="marginGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#293449" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
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
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="margin" name="Net Margin" stroke="#10b981" fill="url(#marginGrad)" />
                  <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8b5cf6" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Velocity Trends */}
        <Card>
          <CardHeader
            title="Sprint Story Point Velocity"
            subtitle="Committed vs Completed Points across 6 Sprints"
          />
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={velocityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#293449" vertical={false} />
                  <XAxis dataKey="sprint" stroke="#64748b" fontSize={11} tickLine={false} />
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
                  <Bar dataKey="committed" name="Committed Points" fill="#334155" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="velocity" name="Delivered Points" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts: Department Spend & Risk Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Departmental Capital Spend ($k)"
            subtitle="Aggregated spend by functional division"
          />
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentMetrics} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#293449" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151c2c',
                      borderColor: '#293449',
                      borderRadius: '0.75rem',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`$${val}k`, 'Spent']}
                  />
                  <Bar dataKey="spend" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Risk Distribution */}
        <Card>
          <CardHeader title="Project Risk Matrix" subtitle="Categorized initiative risk profiles" />
          <CardContent>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={riskCounts} innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {riskCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
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

            <div className="space-y-2 mt-2 pt-3 border-t border-[#293449]">
              {riskCounts.map((rc) => (
                <div key={rc.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rc.color }} />
                    <span className="text-slate-300">{rc.name}</span>
                  </div>
                  <span className="font-bold text-slate-100">{rc.value} Projects</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
