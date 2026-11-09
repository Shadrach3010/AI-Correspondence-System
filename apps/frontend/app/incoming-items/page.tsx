'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useICMS, IncomingItem } from '../../store/icms-store';

export default function IncomingItemsPage() {
  const router = useRouter();
  const { incomingItems, setSelectedIncomingItem, approveAiRouting, deleteIncomingItem } = useICMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  const filteredItems = useMemo(() => {
    return incomingItems.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.body.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchSource = sourceFilter === 'All' || item.source === sourceFilter;

      return matchSearch && matchStatus && matchSource;
    });
  }, [incomingItems, searchTerm, statusFilter, sourceFilter]);

  const handleQuickApprove = (e: React.MouseEvent, item: IncomingItem) => {
    e.stopPropagation();
    approveAiRouting(item.id);
    Swal.fire({
      title: 'Auto-Routed to Department',
      text: `Approved routing for ${item.id} to ${item.aiAnalysis?.recommendedDepartment || 'Registry'}.`,
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleDelete = async (e: React.MouseEvent, item: IncomingItem) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: 'Archive / Remove Intake',
      text: `Archive intake record #${item.id}? This will preserve historical logs.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Archive',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (result.isConfirmed) {
      deleteIncomingItem(item.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Intake Center</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Correspondence Intake & Triage</h1>
          <p className="mt-1 text-xs text-slate-500">
            Raw incoming emails, uploaded letters, and portal inquiries before official departmental conversion.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push('/incoming-items/new')}
          className="rounded-full bg-[#123b75] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/15 transition hover:bg-[#0d2f5f]"
        >
          + Capture New Intake
        </button>
      </header>

      {/* Search & Filters */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search incoming correspondence by subject, sender, reference #..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
            >
              <option value="All">All Sources</option>
              <option value="Email">Email</option>
              <option value="Manual upload">Manual upload</option>
              <option value="Portal">Portal</option>
            </select>

            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
              {['All', 'AI REVIEW', 'PENDING REVIEW', 'AUTO-ROUTED', 'RECEIVED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 font-medium transition ${
                    statusFilter === st ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intake Table */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Incoming Queue</h2>
          <span className="text-xs text-slate-500">{filteredItems.length} items</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Reference</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Subject</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Sender</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">AI Classification</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-500">
                    No incoming items found matching filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedIncomingItem(item)}
                    className="cursor-pointer transition hover:bg-sky-50/50"
                  >
                    <td className="px-4 py-3 text-xs font-bold text-slate-900">{item.id}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-800 max-w-xs truncate">
                      {item.subject}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 truncate">{item.sender}</td>
                    <td className="px-4 py-3 text-xs">
                      {item.aiAnalysis ? (
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-sky-100 px-1.5 py-0.5 font-bold text-sky-800 text-[10px]">
                            {item.aiAnalysis.recommendedDepartment}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">({item.aiAnalysis.confidence}%)</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Pending AI</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.status === 'AUTO-ROUTED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'AI REVIEW'
                            ? 'bg-sky-100 text-sky-800'
                            : item.status === 'PENDING REVIEW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIncomingItem(item);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Triage
                        </button>
                        {item.status !== 'AUTO-ROUTED' && (
                          <button
                            type="button"
                            onClick={(e) => handleQuickApprove(e, item)}
                            className="rounded-lg bg-[#123b75] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#0d2f5f]"
                          >
                            Route
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
