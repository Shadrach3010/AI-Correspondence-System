'use client';

import React from 'react';
import Swal from 'sweetalert2';
import { useICMS } from '../../store/icms-store';

function downloadCsv(rows: string[][], filename: string) {
  const csvContent = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
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

export default function DashboardPage() {
  const { incomingItems, assignments, departments, activities, settings } = useICMS();

  const totalIncoming = incomingItems.length + assignments.length;
  const pendingReview = incomingItems.filter((i) => i.status === 'PENDING REVIEW' || i.status === 'AI REVIEW').length;
  const unassigned = incomingItems.filter((i) => i.status === 'RECEIVED').length;
  const completedCount = assignments.filter((a) => a.status === 'Completed').length;

  const summaryItems = [
    { label: 'Total Ingested', value: totalIncoming.toString(), tone: 'blue' },
    { label: 'Pending Review', value: pendingReview.toString(), tone: 'amber' },
    { label: 'Unassigned Intakes', value: unassigned.toString(), tone: 'red' },
    { label: 'Archived Completed', value: completedCount.toString(), tone: 'green' },
  ];

  const handleExport = async () => {
    const result = await Swal.fire({
      title: 'Export Executive Dashboard Summary',
      text: 'Download executive metrics and department caseloads as CSV?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Download CSV',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (!result.isConfirmed) return;

    const rows: string[][] = [
      ['Metric', 'Value'],
      ['Total Ingested', totalIncoming.toString()],
      ['Pending Review', pendingReview.toString()],
      ['Unassigned Intakes', unassigned.toString()],
      ['Completed & Archived', completedCount.toString()],
      ['AI Confidence Threshold', `${settings.aiThreshold}%`],
      ['', ''],
      ['Department', 'Assigned Cases'],
      ...departments.map((d) => [d.name, assignments.filter((a) => a.department === d.name).length.toString()]),
    ];

    downloadCsv(rows, `icms-executive-dashboard-${new Date().toISOString().slice(0, 10)}.csv`);
    await Swal.fire({
      title: 'Export Downloaded',
      text: 'Executive report generated successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Executive Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Institutional Operations Overview</h1>
            <p className="mt-1 text-xs text-slate-500">
              High-level decision visibility for the Vice Chancellor, Registrar, and Council.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="rounded-full bg-[#123b75] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 transition hover:bg-[#0d2f5f]"
          >
            Export Executive Report
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm"
          >
            <div
              className={`mb-4 h-2 w-16 rounded-full ${
                item.tone === 'blue'
                  ? 'bg-[#123b75]'
                  : item.tone === 'amber'
                  ? 'bg-amber-500'
                  : item.tone === 'red'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`}
            />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Faculty & Department Volume</h2>
          <div className="space-y-4">
            {departments.map((dept) => {
              const liveCount = assignments.filter((a) => a.department === dept.name).length;
              const maxCount = Math.max(...departments.map((d) => assignments.filter((a) => a.department === d.name).length), 1);

              return (
                <div key={dept.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept.name}</span>
                    <span className="text-slate-500 font-bold">{liveCount} Cases</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#123b75] to-sky-500"
                      style={{ width: `${Math.max((liveCount / maxCount) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Executive Events</h2>
          <ul className="space-y-3">
            {activities.slice(0, 6).map((item) => (
              <li key={item.id} className="border-b border-slate-100 pb-3 last:border-none last:pb-0">
                <p className="font-bold text-xs text-slate-800">{item.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{item.detail}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.time}</p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
