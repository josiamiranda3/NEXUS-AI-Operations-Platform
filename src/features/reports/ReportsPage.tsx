import React, { useState, useMemo } from 'react';
import { useNexus } from '../../context/NexusContext';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Sparkles,
  Calendar,
  CheckCircle2,
  DollarSign,
  Briefcase,
  Users2,
  TrendingUp,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { projects, tasks, employees, org, user, showToast } = useNexus();

  const [activeCategory, setActiveCategory] = useState<
    'executive' | 'financial' | 'projects' | 'productivity' | 'team'
  >('executive');
  const [period, setPeriod] = useState<'current_month' | 'q4' | 'ytd'>('q4');

  // Compute live report figures
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const completedProjects = projects.filter((p) => p.status === 'Completed').length;
  const inProgressProjects = projects.filter((p) => p.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const avgProductivity = Math.round(
    employees.reduce((acc, e) => acc + e.productivityScore, 0) / (employees.length || 1)
  );

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (activeCategory === 'projects') {
      csvContent += 'Project Key,Title,Department,Status,Priority,Budget,Spent,Progress,Due Date\n';
      projects.forEach((p) => {
        csvContent += `"${p.key}","${p.title}","${p.department}","${p.status}","${p.priority}",${p.budget},${p.spent},${p.progress}%,"${p.dueDate}"\n`;
      });
    } else if (activeCategory === 'team') {
      csvContent += 'Name,Role,Department,Status,Email,Location,Productivity Score\n';
      employees.forEach((e) => {
        csvContent += `"${e.name}","${e.role}","${e.department}","${e.status}","${e.email}","${e.location}",${e.productivityScore}%\n`;
      });
    } else {
      csvContent += 'Metric,Value,Benchmark,Status\n';
      csvContent += `"Total ARR Run-Rate","$1,284,500","+18.4% YoY","Optimal"\n`;
      csvContent += `"Portfolio Capital Committed","$${totalBudget.toLocaleString()}","$${totalSpent.toLocaleString()} spent","On Target"\n`;
      csvContent += `"Active Initiatives Count","${inProgressProjects}","${projects.length} Total","Nominal"\n`;
      csvContent += `"Tasks Closed Rate","${completedTasks} of ${tasks.length}","${Math.round((completedTasks / (tasks.length || 1)) * 100)}%","Accelerating"\n`;
      csvContent += `"Mean Team Productivity","${avgProductivity}%","Top 5% quartile","High Velocity"\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nexus_${activeCategory.toUpperCase()}_REPORT_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${activeCategory} report to CSV`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
            Reporting & Audit Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate board-ready operational packages, financial audits, and delivery briefings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            icon={<Printer className="w-4 h-4" />}
          >
            Print / Save PDF
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Categories & Period Selector Bar */}
      <Card className="p-4 print:hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'executive', label: 'Executive Briefing' },
              { id: 'financial', label: 'Financial Run-Rate' },
              { id: 'projects', label: 'Initiative Governance' },
              { id: 'productivity', label: 'Productivity Audit' },
              { id: 'team', label: 'Team Allocation' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Timeframe:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-[#293449] bg-[#101522] text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="current_month">Current Month (November 2026)</option>
              <option value="q4">Quarter 4 (Q4 2026)</option>
              <option value="ytd">Year To Date (2026)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Generated Report Sheet */}
      <Card className="p-6 sm:p-8 bg-[#151c2c] border border-[#293449] print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Document Header */}
        <div className="border-b border-[#293449] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-purple-400 font-bold">
              <Sparkles className="w-4 h-4" />
              NEXUS ENTERPRISE AUDIT SYSTEM
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1 capitalize">
              {activeCategory.replace('_', ' ')} Operational Report
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Organization: <strong className="text-slate-200">{org.name}</strong> • Sign-off: {user.name} ({user.title})
            </p>
          </div>

          <div className="text-right text-xs text-slate-400">
            <div>
              Date Generated:{' '}
              <strong className="text-slate-200">{new Date().toISOString().split('T')[0]}</strong>
            </div>
            <div>
              Reporting Window:{' '}
              <strong className="text-slate-200 uppercase">{period}</strong>
            </div>
            <div className="text-emerald-400 font-semibold mt-1">Status: Certified Complete</div>
          </div>
        </div>

        {/* Executive Summary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div className="p-4 rounded-xl bg-[#101522] border border-[#293449] print:bg-slate-50 print:border-slate-300">
            <span className="text-xs text-slate-400">Annual Run-Rate</span>
            <div className="text-xl font-bold text-slate-100 mt-1">$1,284,500</div>
            <span className="text-[11px] text-emerald-400 font-medium">+18.4% YoY</span>
          </div>

          <div className="p-4 rounded-xl bg-[#101522] border border-[#293449] print:bg-slate-50 print:border-slate-300">
            <span className="text-xs text-slate-400">Budget Deployed</span>
            <div className="text-xl font-bold text-slate-100 mt-1">
              ${(totalSpent / 1000).toFixed(0)}k <span className="text-xs text-slate-400">/ ${(totalBudget / 1000).toFixed(0)}k</span>
            </div>
            <span className="text-[11px] text-purple-300 font-medium">
              {Math.round((totalSpent / (totalBudget || 1)) * 100)}% Utilization
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#101522] border border-[#293449] print:bg-slate-50 print:border-slate-300">
            <span className="text-xs text-slate-400">Active Fleet</span>
            <div className="text-xl font-bold text-slate-100 mt-1">{projects.length} Initiatives</div>
            <span className="text-[11px] text-cyan-300 font-medium">{inProgressProjects} In Delivery</span>
          </div>

          <div className="p-4 rounded-xl bg-[#101522] border border-[#293449] print:bg-slate-50 print:border-slate-300">
            <span className="text-xs text-slate-400">Avg Productivity</span>
            <div className="text-xl font-bold text-slate-100 mt-1">{avgProductivity}%</div>
            <span className="text-[11px] text-emerald-400 font-medium">99.4% SLA Pass</span>
          </div>
        </div>

        {/* Category Details Table */}
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
            Itemized Registry Breakdown
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#293449]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101522] border-b border-[#293449] text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="px-4 py-3">Initiative Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Allocated Budget</th>
                  <th className="px-4 py-3">Realized Spend</th>
                  <th className="px-4 py-3">Milestone Progress</th>
                  <th className="px-4 py-3">Delivery Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#293449]/50 text-slate-200">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30">
                    <td className="px-4 py-2.5 font-mono text-purple-400 font-bold">{p.key}</td>
                    <td className="px-4 py-2.5 font-medium">{p.title}</td>
                    <td className="px-4 py-2.5 text-slate-400">{p.department}</td>
                    <td className="px-4 py-2.5 font-mono">${p.budget.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-mono">${p.spent.toLocaleString()}</td>
                    <td className="px-4 py-2.5 font-semibold text-purple-300">{p.progress}%</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Sign-off block */}
        <div className="mt-10 pt-6 border-t border-[#293449] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <div className="font-semibold text-slate-200">Compliance & Governance Attestation</div>
            <div className="mt-0.5">
              Verified against Nexus Telemetry, AWS Cost & Usage Ingestion, and Jira Sprint Logs.
            </div>
          </div>
          <div className="border border-[#293449] rounded-xl px-4 py-2 bg-[#101522] text-right">
            <span className="text-[10px] uppercase text-slate-500 font-mono block">Officer In Charge</span>
            <span className="font-semibold text-slate-200">{user.name}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
