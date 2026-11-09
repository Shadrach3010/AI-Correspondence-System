'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useICMS, Assignment } from '../store/icms-store';

export function AssignmentPreviewModal() {
  const {
    selectedAssignment,
    setSelectedAssignment,
    advanceAssignmentWorkflow,
    rejectAssignmentWorkflow,
    reassignAssignment,
    recallAssignment,
    addAssignmentComment,
    departments,
    users,
  } = useICMS();

  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'workflow' | 'ai' | 'timeline'>('details');

  if (!selectedAssignment) return null;

  const handleClose = () => setSelectedAssignment(null);

  const handleAdvance = async () => {
    const { value: remarks } = await Swal.fire({
      title: 'Advance Workflow Stage',
      input: 'textarea',
      inputLabel: 'Sign-off Remarks & Directives (Optional)',
      inputPlaceholder: 'Enter review notes or approval directives for the next department...',
      showCancelButton: true,
      confirmButtonText: 'Advance Stage',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (remarks !== undefined) {
      advanceAssignmentWorkflow(selectedAssignment.id, remarks);
      await Swal.fire({
        title: 'Stage Advanced',
        text: 'The correspondence has successfully transitioned to the next workflow stage.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleRevert = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Send Back for Clarification',
      input: 'textarea',
      inputLabel: 'Reason for Reversion / Query',
      inputPlaceholder: 'State clearly what information or correction is required...',
      inputValidator: (value) => {
        if (!value?.trim()) return 'You must provide a reason to revert the stage.';
      },
      showCancelButton: true,
      confirmButtonText: 'Send Back',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#b91c1c',
    });

    if (reason) {
      rejectAssignmentWorkflow(selectedAssignment.id, reason);
      await Swal.fire({
        title: 'Workflow Reverted',
        text: 'Returned to previous stage with clarification notes.',
        icon: 'info',
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleReassign = async () => {
    const deptOptionsHtml = departments
      .map((d) => `<option value="${d.name}" ${d.name === selectedAssignment.department ? 'selected' : ''}>${d.name}</option>`)
      .join('');

    const userOptionsHtml = users
      .map((u) => `<option value="${u.name}">${u.name} (${u.role} - ${u.department})</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Reassign Correspondence Lead',
      html: `
        <div style="text-align:left; font-size:14px; display:flex; flex-direction:column; gap:12px;">
          <label><strong>Target Department:</strong>
            <select id="swal-reassign-dept" class="swal2-input" style="width:100%; margin-top:4px;">
              ${deptOptionsHtml}
            </select>
          </label>
          <label><strong>Assignee Officer:</strong>
            <select id="swal-reassign-user" class="swal2-input" style="width:100%; margin-top:4px;">
              ${userOptionsHtml}
            </select>
          </label>
          <label><strong>Reassignment Note:</strong>
            <textarea id="swal-reassign-notes" class="swal2-textarea" placeholder="Instructions for new assignee..." style="width:100%; margin-top:4px; height:80px;"></textarea>
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm Reassignment',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
      preConfirm: () => {
        const dept = (document.getElementById('swal-reassign-dept') as HTMLSelectElement)?.value;
        const user = (document.getElementById('swal-reassign-user') as HTMLSelectElement)?.value;
        const notes = (document.getElementById('swal-reassign-notes') as HTMLTextAreaElement)?.value;
        return { dept, user, notes };
      },
    });

    if (formValues && formValues.dept && formValues.user) {
      reassignAssignment(selectedAssignment.id, formValues.user, formValues.dept, formValues.notes);
      await Swal.fire({
        title: 'Reassigned Successfully',
        text: `Correspondence reassigned to ${formValues.user} (${formValues.dept}).`,
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleRecall = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Executive Recall of Correspondence',
      text: 'This will stop and suspend the active workflow under executive authority (Vice Chancellor / Registrar).',
      input: 'textarea',
      inputLabel: 'Recall Justification',
      inputPlaceholder: 'State reason for executive intervention...',
      inputValidator: (value) => {
        if (!value?.trim()) return 'A justification is required for executive recall.';
      },
      showCancelButton: true,
      confirmButtonText: 'Execute Recall',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#991b1b',
    });

    if (reason) {
      recallAssignment(selectedAssignment.id, reason);
      await Swal.fire({
        title: 'Correspondence Recalled',
        text: 'The workflow has been suspended and marked as Recalled.',
        icon: 'warning',
      });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addAssignmentComment(selectedAssignment.id, commentText.trim(), 'Reviewing Officer');
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-all duration-300">
      <div
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-sky-950 to-[#123b75] p-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
                  {selectedAssignment.correspondenceId}
                </span>
                <span className="rounded-md bg-sky-400/25 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-sky-200">
                  {selectedAssignment.category}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                    selectedAssignment.priority === 'High'
                      ? 'bg-rose-500/80 text-white'
                      : selectedAssignment.priority === 'Medium'
                      ? 'bg-amber-400/80 text-slate-950'
                      : 'bg-emerald-500/80 text-white'
                  }`}
                >
                  {selectedAssignment.priority} Priority
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    selectedAssignment.status === 'Completed'
                      ? 'bg-emerald-400/30 text-emerald-200'
                      : selectedAssignment.status === 'Recalled'
                      ? 'bg-rose-400/30 text-rose-200'
                      : 'bg-sky-300/30 text-sky-100'
                  }`}
                >
                  {selectedAssignment.status}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold leading-snug">{selectedAssignment.title}</h2>
              <p className="mt-1 text-xs text-sky-200">
                Sender: <span className="font-semibold text-white">{selectedAssignment.sender}</span> · Assigned to:{' '}
                <span className="font-semibold text-white">{selectedAssignment.owner}</span> ({selectedAssignment.department})
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/10 p-2 text-slate-300 transition hover:bg-white/20 hover:text-white"
              aria-label="Close preview"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-5 flex gap-2 border-t border-white/10 pt-3">
            {(
              [
                { id: 'details', label: 'Correspondence Details' },
                { id: 'workflow', label: `Workflow (${selectedAssignment.workflowStages.length} Stages)` },
                { id: 'ai', label: `AI Insights (${selectedAssignment.aiConfidence}%)` },
                { id: 'timeline', label: `Audit & Notes (${selectedAssignment.comments.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Source</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{selectedAssignment.source}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Due Deadline</p>
                  <p className="mt-1 text-sm font-bold text-rose-600">{selectedAssignment.due}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Department</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{selectedAssignment.department}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Risk Assessment</p>
                  <span
                    className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                      selectedAssignment.risk === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : selectedAssignment.risk === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {selectedAssignment.risk} Risk
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Official Communication Text</h3>
                <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {selectedAssignment.body || 'No textual content provided.'}
                </div>
              </div>

              {/* Attachments */}
              {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Institutional Attachments ({selectedAssignment.attachments.length})
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {selectedAssignment.attachments.map((att) => (
                      <div
                        key={att.name}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition hover:border-slate-300 hover:bg-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{att.name}</p>
                            <p className="text-[10px] text-slate-500">{att.size} · {att.type}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            Swal.fire({
                              title: 'File Download Simulated',
                              text: `Downloading official document: ${att.name}`,
                              icon: 'info',
                              timer: 1500,
                              showConfirmButton: false,
                            })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          View / Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sequential Departmental Pipeline</h3>
                  <p className="text-xs text-slate-500">Each stage must be completed before the next department is activated.</p>
                </div>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                  Stage {Math.min(selectedAssignment.currentStageIndex + 1, selectedAssignment.workflowStages.length)} of{' '}
                  {selectedAssignment.workflowStages.length}
                </span>
              </div>

              <div className="relative space-y-4 before:absolute before:bottom-3 before:left-6 before:top-3 before:w-0.5 before:bg-slate-200">
                {selectedAssignment.workflowStages.map((stage, idx) => {
                  const isCurrent = idx === selectedAssignment.currentStageIndex;
                  const isCompleted = stage.status === 'Completed';
                  const isPending = stage.status === 'Pending' || stage.status === 'Queued';

                  return (
                    <div
                      key={stage.id || idx}
                      className={`relative flex items-start gap-4 rounded-2xl border p-4 transition ${
                        isCurrent
                          ? 'border-sky-300 bg-sky-50/70 shadow-sm'
                          : isCompleted
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : 'border-slate-200 bg-white opacity-80'
                      }`}
                    >
                      {/* Step Badge */}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold shadow-sm ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-[#123b75] text-white ring-4 ring-sky-200'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isCompleted ? '✓' : idx + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-bold text-slate-900">{stage.name}</h4>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCurrent
                                ? 'bg-blue-100 text-blue-800'
                                : stage.status === 'Blocked'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {stage.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-600">
                          Unit: <span className="font-semibold text-slate-800">{stage.department}</span> · Officer:{' '}
                          <span className="font-semibold text-slate-800">{stage.owner}</span> · SLA: {stage.slaDays} days
                        </p>

                        {stage.requiredAction && (
                          <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900">
                            <strong>Mandatory Requirement:</strong> {stage.requiredAction}
                          </div>
                        )}

                        {stage.notes && (
                          <p className="mt-2 text-xs italic text-slate-500">
                            Note: &ldquo;{stage.notes}&rdquo; {stage.completedAt ? `(Completed at ${stage.completedAt})` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-sky-200 bg-sky-50/60 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                    <h3 className="font-bold text-slate-900">Gemini Document Understanding</h3>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sky-900 shadow-sm">
                    {selectedAssignment.aiConfidence}% Routing Confidence
                  </span>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-700">{selectedAssignment.aiSummary}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recommended Routing</h4>
                  <p className="mt-2 text-lg font-bold text-[#123b75]">{selectedAssignment.department}</p>
                  <p className="mt-1 text-xs text-slate-500">Selected based on university taxonomy & jurisdiction.</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Policy Rules & Governance</h4>
                  {selectedAssignment.policyFlags && selectedAssignment.policyFlags.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {selectedAssignment.policyFlags.map((flag) => (
                        <span key={flag} className="rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
                          {flag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-emerald-600 font-medium">No policy violations or confidential holds.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Audit Trail & Discussion Log</h4>

                <div className="mt-4 space-y-3">
                  {selectedAssignment.comments.map((c) => (
                    <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {c.author} <span className="font-normal text-slate-500">({c.role})</span>
                        </span>
                        <span className="text-slate-400">{c.timestamp}</span>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">{c.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add an official directive, audit note, or clarification..."
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[#123b75] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0d2f5f]"
                  >
                    Post Note
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRecall}
              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
            >
              Executive Recall
            </button>
            <button
              type="button"
              onClick={handleRevert}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Request Clarification
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReassign}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-100"
            >
              Reassign Owner
            </button>

            {selectedAssignment.status !== 'Completed' && (
              <button
                type="button"
                onClick={handleAdvance}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-900/15 hover:bg-emerald-700"
              >
                Advance Workflow Stage →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
