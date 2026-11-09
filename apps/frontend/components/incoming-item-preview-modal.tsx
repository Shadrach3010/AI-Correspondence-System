'use client';

import React from 'react';
import Swal from 'sweetalert2';
import { useICMS } from '../store/icms-store';

export function IncomingItemPreviewModal() {
  const { selectedIncomingItem, setSelectedIncomingItem, approveAiRouting, overrideAiRouting, departments } = useICMS();

  if (!selectedIncomingItem) return null;

  const handleClose = () => setSelectedIncomingItem(null);

  const handleApprove = () => {
    approveAiRouting(selectedIncomingItem.id);
    setSelectedIncomingItem(null);
    Swal.fire({
      title: 'Auto-Routed to Department',
      text: `Item was accepted and converted into active correspondence in ${selectedIncomingItem.aiAnalysis?.recommendedDepartment || 'Registry'}.`,
      icon: 'success',
      confirmButtonColor: '#123b75',
    });
  };

  const handleManualRoute = async () => {
    const deptOptionsHtml = departments
      .map((d) => `<option value="${d.name}">${d.name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Manual Routing Override',
      html: `
        <div style="text-align:left; font-size:14px; display:flex; flex-direction:column; gap:12px;">
          <label><strong>Assign to Department:</strong>
            <select id="swal-manual-dept" class="swal2-input" style="width:100%; margin-top:4px;">
              ${deptOptionsHtml}
            </select>
          </label>
          <label><strong>Category:</strong>
            <select id="swal-manual-cat" class="swal2-input" style="width:100%; margin-top:4px;">
              <option value="PROCUREMENT">Procurement</option>
              <option value="STUDENT_CASE">Student Case / Grievance</option>
              <option value="GOVERNANCE">Governance / Senate</option>
              <option value="GENERAL">General Administration</option>
            </select>
          </label>
          <label><strong>Routing Directive / Reason:</strong>
            <textarea id="swal-manual-reason" class="swal2-textarea" placeholder="Provide reason for routing..." style="width:100%; margin-top:4px; height:70px;"></textarea>
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm Route',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
      preConfirm: () => {
        const dept = (document.getElementById('swal-manual-dept') as HTMLSelectElement)?.value;
        const cat = (document.getElementById('swal-manual-cat') as HTMLSelectElement)?.value;
        const reason = (document.getElementById('swal-manual-reason') as HTMLTextAreaElement)?.value;
        return { dept, cat, reason };
      },
    });

    if (formValues && formValues.dept) {
      overrideAiRouting(selectedIncomingItem.id, formValues.dept, formValues.cat, formValues.reason);
      setSelectedIncomingItem(null);
      await Swal.fire({
        title: 'Manually Assigned',
        text: `Intake assigned to ${formValues.dept} under category ${formValues.cat}.`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-200 bg-[#0f172a] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase">{selectedIncomingItem.id}</span>
                <span className="rounded-md bg-sky-400/20 px-2 py-0.5 text-xs font-semibold text-sky-200">{selectedIncomingItem.source}</span>
                <span className="rounded-md bg-amber-400/20 px-2 py-0.5 text-xs font-semibold text-amber-300">{selectedIncomingItem.status}</span>
              </div>
              <h2 className="mt-2 text-xl font-bold">{selectedIncomingItem.subject}</h2>
              <p className="mt-1 text-xs text-slate-300">From: <span className="font-semibold text-white">{selectedIncomingItem.sender}</span></p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Triage Card */}
          {selectedIncomingItem.aiAnalysis && (
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-sky-900">AI Triage Recommendation</p>
                <span className="rounded-full bg-sky-200/80 px-2.5 py-0.5 text-xs font-bold text-sky-900">
                  {selectedIncomingItem.aiAnalysis.confidence}% Confidence
                </span>
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-800">
                Recommended Department: <span className="text-[#123b75]">{selectedIncomingItem.aiAnalysis.recommendedDepartment}</span> ({selectedIncomingItem.aiAnalysis.category})
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{selectedIncomingItem.aiAnalysis.summary}</p>
            </div>
          )}

          {/* Email Body */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Message Content</p>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-800 leading-relaxed">
              {selectedIncomingItem.body}
            </div>
          </div>

          {/* Attachments */}
          {selectedIncomingItem.attachments && selectedIncomingItem.attachments.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Attachments ({selectedIncomingItem.attachments.length})</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {selectedIncomingItem.attachments.map((att) => (
                  <div key={att.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <span className="text-xs font-medium text-slate-800 truncate">{att.name}</span>
                    <span className="text-[10px] text-slate-400">{att.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4">
          <button
            type="button"
            onClick={handleManualRoute}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Manual Route Override...
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="rounded-xl bg-[#123b75] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0d2f5f]"
            >
              Approve AI Route & Assign →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
