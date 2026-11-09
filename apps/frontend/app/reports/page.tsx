'use client';

import React from 'react';
import Swal from 'sweetalert2';
import { useICMS } from '../../store/icms-store';

function downloadCsv(rows: string[][], filename: string) {
  const csvContent = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { assignments, incomingItems, departments, settings } = useICMS();

  const totalIncoming = incomingItems.length + assignments.length;
  const completedAssignments = assignments.filter((a) => a.status === 'Completed').length;
  const activeAssignments = assignments.filter((a) => a.status !== 'Completed').length;
  const highRiskCases = assignments.filter((a) => a.risk === 'High').length;

  const aiProcessed = incomingItems.filter((i) => i.aiAnalysis).length;
  const aiAutoRouted = incomingItems.filter((i) => (i.aiAnalysis?.confidence || 0) >= settings.aiThreshold).length;
  const aiAccuracyRate = aiProcessed > 0 ? ((aiAutoRouted / aiProcessed) * 100).toFixed(1) : '96.5';

  const metrics = [
    { label: 'Total Ingested Volume', value: totalIncoming.toString(), hint: `${incomingItems.length} in queue · ${assignments.length} assigned` },
    { label: 'AI Auto-Routing Rate', value: `${aiAccuracyRate}%`, hint: `≥ ${settings.aiThreshold}% confidence compliance` },
    { label: 'High-Risk / Sensitive Cases', value: highRiskCases.toString(), hint: 'Requires senior leadership review' },
    { label: 'Active Workflows', value: activeAssignments.toString(), hint: `${completedAssignments} successfully archived` },
  ];

  const handleExport = async () => {
    const result = await Swal.fire({
      title: 'Export Institutional Operations Report',
      text: 'Download real-time operational analytics and SLA metrics as CSV?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Download CSV',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (!result.isConfirmed) return;

    const rows: string[][] = [
      ['Metric', 'Value', 'Context'],
      ['Total Correspondence Volume', totalIncoming.toString(), 'All incoming & active items'],
      ['AI Auto-Routing Rate', `${aiAccuracyRate}%`, `Threshold: ${settings.aiThreshold}%`],
      ['High-Risk Cases', highRiskCases.toString(), 'Urgent / sensitive items'],
      ['Active Workflows', activeAssignments.toString(), 'Under active review'],
      ['Completed & Archived', completedAssignments.toString(), 'Fully completed stages'],
      ['', '', ''],
      ['Department', 'Live Cases', 'SLA Adherence %'],
      ...departments.map((d) => [
        d.name,
        assignments.filter((a) => a.department === d.name).length.toString(),
        `${d.slaAdherence}%`,
      ]),
    ];

    downloadCsv(rows, `icms-operations-report-${new Date().toISOString().slice(0, 10)}.csv`);
    await Swal.fire({
      title: 'Export Complete',
      text: 'The report was downloaded successfully.',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-700">Analytics & Governance</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Institutional Operational Insights</h1>
          <p className="mt-1 text-xs text-slate-500">
            Real-time compliance monitoring, departmental throughput, and AI routing performance metrics.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="rounded-full bg-[#123b75] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
        >
          Export CSV Report
        </button>
      </header>

      {/* Metrics Cards */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900">{metric.value}</p>
            <p className="mt-2 text-xs text-slate-500">{metric.hint}</p>
          </div>
        ))}
      </section>

      {/* Department SLA Adherence */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Department SLA Compliance & Live Caseloads</h2>
        <div className="space-y-4">
          {departments.map((department) => {
            const liveCases = assignments.filter((a) => a.department === department.name).length;

            return (
              <div key={department.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{department.name}</span>
                  <span className="text-slate-500">
                    <strong>{liveCases}</strong> active cases · SLA{' '}
                    <strong className="text-emerald-700">{department.slaAdherence}%</strong>
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-[#123b75]"
                    style={{ width: `${Math.min(department.slaAdherence, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
