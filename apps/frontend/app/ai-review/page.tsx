'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useICMS, IncomingItem } from '../../store/icms-store';

export default function AiReviewPage() {
  const { incomingItems, approveAiRouting, overrideAiRouting, escalateAiItem, setSelectedIncomingItem, departments, settings } = useICMS();
  const [filter, setFilter] = useState<'All' | 'High Confidence' | 'Needs Review'>('All');

  const aiItems = incomingItems.filter((item) => item.aiAnalysis);

  const filteredAiItems = aiItems.filter((item) => {
    if (filter === 'High Confidence') return (item.aiAnalysis?.confidence || 0) >= settings.aiThreshold;
    if (filter === 'Needs Review') return (item.aiAnalysis?.confidence || 0) < settings.aiThreshold || item.status === 'PENDING REVIEW';
    return true;
  });

  const handleApprove = (item: IncomingItem) => {
    approveAiRouting(item.id);
    Swal.fire({
      title: 'AI Decision Approved',
      text: `Routed to ${item.aiAnalysis?.recommendedDepartment} (${item.aiAnalysis?.category}) with ${item.aiAnalysis?.confidence}% confidence.`,
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleOverride = async (item: IncomingItem) => {
    const deptOptionsHtml = departments
      .map((d) => `<option value="${d.name}" ${d.name === item.aiAnalysis?.recommendedDepartment ? 'selected' : ''}>${d.name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Override AI Routing Recommendation',
      html: `
        <div style="text-align:left; font-size:14px; display:flex; flex-direction:column; gap:12px;">
          <label><strong>Assign to Department:</strong>
            <select id="swal-override-dept" class="swal2-input" style="width:100%; margin-top:4px;">
              ${deptOptionsHtml}
            </select>
          </label>
          <label><strong>Classification:</strong>
            <select id="swal-override-cat" class="swal2-input" style="width:100%; margin-top:4px;">
              <option value="PROCUREMENT">Procurement</option>
              <option value="STUDENT_CASE">Student Case</option>
              <option value="GOVERNANCE">Governance / Senate</option>
              <option value="GENERAL">General Administration</option>
            </select>
          </label>
          <label><strong>Override Justification:</strong>
            <textarea id="swal-override-reason" class="swal2-textarea" placeholder="Explain why AI routing is being redirected..." style="width:100%; margin-top:4px; height:70px;"></textarea>
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm Override',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
      preConfirm: () => {
        const dept = (document.getElementById('swal-override-dept') as HTMLSelectElement)?.value;
        const cat = (document.getElementById('swal-override-cat') as HTMLSelectElement)?.value;
        const reason = (document.getElementById('swal-override-reason') as HTMLTextAreaElement)?.value;
        return { dept, cat, reason };
      },
    });

    if (formValues && formValues.dept) {
      overrideAiRouting(item.id, formValues.dept, formValues.cat, formValues.reason);
      await Swal.fire({
        title: 'Override Applied',
        text: `Manually routed to ${formValues.dept}.`,
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleEscalate = async (item: IncomingItem) => {
    const { value: reason } = await Swal.fire({
      title: 'Escalate to Senate / Leadership',
      text: 'Send correspondence for executive policy determination.',
      input: 'textarea',
      inputLabel: 'Escalation Note',
      inputPlaceholder: 'Reason for escalation...',
      inputValidator: (val) => {
        if (!val?.trim()) return 'Escalation note is required.';
      },
      showCancelButton: true,
      confirmButtonText: 'Escalate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#b91c1c',
    });

    if (reason) {
      escalateAiItem(item.id, reason);
      await Swal.fire({
        title: 'Item Escalated',
        text: 'Sent for leadership policy determination.',
        icon: 'warning',
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">AI Intelligence</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Routing Intelligence & Governance</h1>
            <p className="mt-1 text-xs text-slate-500">
              AI recommendations with confidence threshold of {settings.aiThreshold}%. Institutional governance rules take precedence.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-800">
              {aiItems.length} Processed Decisions
            </span>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs font-medium">
            {(['All', 'High Confidence', 'Needs Review'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-xl px-4 py-2 transition ${
                  filter === tab ? 'bg-[#123b75] text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">{filteredAiItems.length} matching</span>
        </div>
      </section>

      {/* Decisions List */}
      <section className="space-y-4">
        {filteredAiItems.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-12 text-center text-slate-500">
            <p className="text-sm font-semibold">No AI routing items in this filter view.</p>
          </div>
        ) : (
          filteredAiItems.map((item) => {
            const confidence = item.aiAnalysis?.confidence || 0;
            const isHighConfidence = confidence >= settings.aiThreshold;

            return (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">{item.id}</span>
                      <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-800">
                        {item.aiAnalysis?.category}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isHighConfidence
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {confidence}% Confidence {isHighConfidence ? '(Auto-eligible)' : '(Human Review Required)'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{item.subject}</h3>
                    <p className="text-xs text-slate-500">Sender: <strong className="text-slate-700">{item.sender}</strong></p>

                    <p className="mt-2 text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <strong>AI Rationale:</strong> {item.aiAnalysis?.summary}
                    </p>

                    {item.aiAnalysis?.policyFlags && item.aiAnalysis.policyFlags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-bold text-rose-700">Governance Flags:</span>
                        {item.aiAnalysis.policyFlags.map((flag) => (
                          <span key={flag} className="rounded bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                            {flag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Target Department</p>
                      <p className="text-base font-bold text-[#123b75]">{item.aiAnalysis?.recommendedDepartment}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedIncomingItem(item)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Inspect Payload
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOverride(item)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Override...
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEscalate(item)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        Escalate
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(item)}
                        className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                      >
                        Approve Route →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
