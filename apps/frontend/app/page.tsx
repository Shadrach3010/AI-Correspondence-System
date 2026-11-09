'use client';

import React from 'react';
import Link from 'next/link';
import { useICMS } from '../store/icms-store';

export default function Home() {
  const { incomingItems, assignments, departments, activities } = useICMS();

  const totalIncoming = incomingItems.length + assignments.length;
  const pendingReview = incomingItems.filter((i) => i.status === 'PENDING REVIEW' || i.status === 'AI REVIEW').length;
  const unassigned = incomingItems.filter((i) => i.status === 'RECEIVED').length;
  const highRiskCount = assignments.filter((a) => a.risk === 'High').length;

  const summaryItems = [
    { label: 'Total incoming', value: totalIncoming.toString(), tone: 'blue', href: '/incoming-items' },
    { label: 'Pending review', value: pendingReview.toString(), tone: 'amber', href: '/ai-review' },
    { label: 'High risk / Escalated', value: highRiskCount.toString(), tone: 'red', href: '/assignments' },
    { label: 'SLA compliance', value: '94.8%', tone: 'green', href: '/reports' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(135deg,#123b75_0%,#1d4f91_42%,#0f172a_100%)] p-8 text-white shadow-[0_18px_40px_rgba(15,23,42,0.14)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-200">Academic Operations Portal</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Institutional Correspondence at a Glance</h1>
            <p className="max-w-xl text-xs sm:text-sm text-sky-100 leading-relaxed">
              Coordinate university intake, sequential departmental routing, AI classification, and executive approvals with auditable governance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/incoming-items/new"
              className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 shadow-md transition hover:bg-sky-50"
            >
              + New Intake
            </Link>
            <Link
              href="/workflow"
              className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Workflow Engine →
            </Link>
          </div>
        </div>
      </section>

      {/* Summary KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {summaryItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group block rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_24px_40px_rgba(17,24,39,0.12)]"
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
            <p className="mt-2 text-3xl font-bold text-slate-900 group-hover:text-[#123b75]">{item.value}</p>
          </Link>
        ))}
      </section>

      {/* Grid: Department Caseload & Recent Activity */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Departmental Volume & Assignments</h2>
              <p className="text-xs text-slate-500">Live active cases across faculties</p>
            </div>
            <Link href="/departments" className="text-xs font-bold text-[#123b75] hover:underline">
              View Units →
            </Link>
          </div>

          <div className="space-y-4">
            {departments.map((dept) => {
              const liveCount = assignments.filter((a) => a.department === dept.name).length;
              const maxCount = Math.max(...departments.map((d) => assignments.filter((a) => a.department === d.name).length), 1);

              return (
                <div key={dept.name}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept.name}</span>
                    <span className="font-bold text-slate-900">{liveCount} active</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#123b75] to-sky-500 transition-all duration-500"
                      style={{ width: `${Math.max((liveCount / maxCount) * 100, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Audit Feed */}
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Live Activity Feed</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Live Feed
            </span>
          </div>

          <ul className="space-y-3">
            {activities.slice(0, 5).map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-none last:pb-0">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">{entry.title}</p>
                  <p className="text-[11px] text-slate-500 leading-snug">{entry.detail}</p>
                  <p className="text-[10px] font-medium text-slate-400">{entry.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
