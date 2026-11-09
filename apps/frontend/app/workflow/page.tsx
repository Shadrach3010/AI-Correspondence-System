'use client';

import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useICMS, WorkflowStage } from '../../store/icms-store';

export default function WorkflowPage() {
  const {
    assignments,
    advanceAssignmentWorkflow,
    rejectAssignmentWorkflow,
    reassignAssignment,
    recallAssignment,
    updateAssignment,
    setSelectedAssignment,
    departments,
    users,
  } = useICMS();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(assignments[0]?.id || '');

  const activeAssignment = useMemo(() => {
    return assignments.find((a) => a.id === selectedCaseId) || assignments[0];
  }, [assignments, selectedCaseId]);

  if (!activeAssignment) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-12 text-center text-slate-500">
        <h2 className="text-xl font-bold text-slate-900">No Active Workflows</h2>
        <p className="mt-2 text-sm">There are currently no active correspondence items in the workflow engine.</p>
      </div>
    );
  }

  const currentStage = activeAssignment.workflowStages[activeAssignment.currentStageIndex];
  const isFinished = activeAssignment.currentStageIndex >= activeAssignment.workflowStages.length;

  const handleAdvanceStage = async () => {
    if (isFinished) {
      await Swal.fire({
        title: 'Workflow Already Completed',
        text: 'This correspondence has passed all stages and is filed in the institutional archive.',
        icon: 'info',
        confirmButtonColor: '#123b75',
      });
      return;
    }

    const { value: remarks } = await Swal.fire({
      title: 'Advance Workflow Stage',
      text: `Sign off on "${currentStage?.name}" and pass correspondence to the next department?`,
      input: 'textarea',
      inputLabel: 'Review Comments / Directives (Optional)',
      inputPlaceholder: 'Add sign-off notes or instructions for the receiving department...',
      showCancelButton: true,
      confirmButtonText: 'Advance Stage',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (remarks !== undefined) {
      advanceAssignmentWorkflow(activeAssignment.id, remarks);
      await Swal.fire({
        title: 'Workflow Advanced',
        text: `Moved to next stage successfully.`,
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleSendBack = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Revert to Previous Stage',
      text: 'Send this correspondence back to the previous department for amendment or query clarification.',
      input: 'textarea',
      inputLabel: 'Reason for Reversion',
      inputPlaceholder: 'State reason clearly...',
      inputValidator: (value) => {
        if (!value?.trim()) return 'Reason is required to revert a workflow stage.';
      },
      showCancelButton: true,
      confirmButtonText: 'Revert Stage',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#b91c1c',
    });

    if (reason) {
      rejectAssignmentWorkflow(activeAssignment.id, reason);
      await Swal.fire({
        title: 'Stage Reverted',
        text: 'Correspondence returned to prior unit.',
        icon: 'info',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleReassignLead = async () => {
    const deptOptionsHtml = departments
      .map((d) => `<option value="${d.name}" ${d.name === currentStage?.department ? 'selected' : ''}>${d.name}</option>`)
      .join('');

    const userOptionsHtml = users
      .map((u) => `<option value="${u.name}">${u.name} (${u.role} - ${u.department})</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Delegate Current Stage Lead',
      html: `
        <div style="text-align:left; font-size:14px; display:flex; flex-direction:column; gap:12px;">
          <label><strong>Department:</strong>
            <select id="swal-wf-dept" class="swal2-input" style="width:100%; margin-top:4px;">
              ${deptOptionsHtml}
            </select>
          </label>
          <label><strong>Designated Officer:</strong>
            <select id="swal-wf-user" class="swal2-input" style="width:100%; margin-top:4px;">
              ${userOptionsHtml}
            </select>
          </label>
          <label><strong>Handover Note:</strong>
            <textarea id="swal-wf-note" class="swal2-textarea" placeholder="Instructions for handover..." style="width:100%; margin-top:4px; height:70px;"></textarea>
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Confirm Handover',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
      preConfirm: () => {
        const dept = (document.getElementById('swal-wf-dept') as HTMLSelectElement)?.value;
        const user = (document.getElementById('swal-wf-user') as HTMLSelectElement)?.value;
        const note = (document.getElementById('swal-wf-note') as HTMLTextAreaElement)?.value;
        return { dept, user, note };
      },
    });

    if (formValues && formValues.dept && formValues.user) {
      reassignAssignment(activeAssignment.id, formValues.user, formValues.dept, formValues.note);
      await Swal.fire({
        title: 'Stage Lead Updated',
        text: `Assigned to ${formValues.user} (${formValues.dept}).`,
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleAddCustomStage = async () => {
    const deptOptionsHtml = departments
      .map((d) => `<option value="${d.name}">${d.name}</option>`)
      .join('');

    const { value: formValues } = await Swal.fire({
      title: 'Append Custom Workflow Stage',
      html: `
        <div style="text-align:left; font-size:14px; display:flex; flex-direction:column; gap:12px;">
          <label><strong>Stage Title:</strong>
            <input id="swal-newstage-name" class="swal2-input" placeholder="e.g. Legal Compliance Review" style="width:100%; margin-top:4px;" />
          </label>
          <label><strong>Department:</strong>
            <select id="swal-newstage-dept" class="swal2-input" style="width:100%; margin-top:4px;">
              ${deptOptionsHtml}
            </select>
          </label>
          <label><strong>Responsible Officer / Role:</strong>
            <input id="swal-newstage-owner" class="swal2-input" placeholder="e.g. Legal Counsel" style="width:100%; margin-top:4px;" />
          </label>
          <label><strong>SLA Duration (Days):</strong>
            <input id="swal-newstage-sla" type="number" value="2" class="swal2-input" style="width:100%; margin-top:4px;" />
          </label>
          <label><strong>Action Mandate:</strong>
            <textarea id="swal-newstage-action" class="swal2-textarea" placeholder="Mandatory requirements for this unit..." style="width:100%; margin-top:4px; height:60px;"></textarea>
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Stage',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
      preConfirm: () => {
        const name = (document.getElementById('swal-newstage-name') as HTMLInputElement)?.value;
        const dept = (document.getElementById('swal-newstage-dept') as HTMLSelectElement)?.value;
        const owner = (document.getElementById('swal-newstage-owner') as HTMLInputElement)?.value;
        const sla = parseInt((document.getElementById('swal-newstage-sla') as HTMLInputElement)?.value || '2', 10);
        const action = (document.getElementById('swal-newstage-action') as HTMLTextAreaElement)?.value;
        if (!name?.trim()) {
          Swal.showValidationMessage('Stage title is required');
          return null;
        }
        return { name, dept, owner: owner || dept, sla, action };
      },
    });

    if (formValues) {
      const newStage: WorkflowStage = {
        id: `ws-custom-${Date.now()}`,
        name: formValues.name,
        department: formValues.dept,
        owner: formValues.owner,
        status: 'Queued',
        slaDays: formValues.sla,
        requiredAction: formValues.action,
      };

      const updatedStages = [...activeAssignment.workflowStages, newStage];
      updateAssignment(activeAssignment.id, { workflowStages: updatedStages });

      await Swal.fire({
        title: 'Stage Appended',
        text: `"${formValues.name}" added to the sequential route.`,
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  const handleExecutiveRecall = async () => {
    const { value: reason } = await Swal.fire({
      title: 'Executive Recall of Correspondence',
      text: 'Stop and suspend this active workflow immediately under Vice Chancellor / Registrar authority.',
      input: 'textarea',
      inputLabel: 'Recall Mandate Reason',
      inputPlaceholder: 'Reason for executive intervention...',
      inputValidator: (val) => {
        if (!val?.trim()) return 'Reason is required to recall.';
      },
      showCancelButton: true,
      confirmButtonText: 'Execute Recall',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#991b1b',
    });

    if (reason) {
      recallAssignment(activeAssignment.id, reason);
      await Swal.fire({
        title: 'Workflow Recalled',
        text: 'The process has been suspended and marked in the audit ledger.',
        icon: 'warning',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">Workflow Engine</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Sequential Departmental Routing</h1>
            <p className="mt-1 text-xs text-slate-500">
              Institutional business rules mandate strict sequential progression through authorized departmental stages.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddCustomStage}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              + Append Stage
            </button>
            <button
              type="button"
              disabled={isFinished}
              onClick={handleAdvanceStage}
              className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-700 disabled:opacity-50"
            >
              Advance Stage →
            </button>
          </div>
        </div>
      </section>

      {/* Case Selector Dropdown */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Correspondence Workflow Case:
          </label>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-900 outline-none focus:border-sky-500"
          >
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.correspondenceId}: {a.title} ({a.status})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Active Case Details Banner */}
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-sky-950 to-[#123b75] p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-white/20 px-2 py-0.5 text-xs font-bold tracking-wide">{activeAssignment.correspondenceId}</span>
              <span className="rounded-md bg-sky-400/20 px-2 py-0.5 text-xs font-semibold text-sky-200">{activeAssignment.category}</span>
              <span className="rounded-md bg-emerald-400/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">{activeAssignment.status}</span>
            </div>
            <h2 className="text-xl font-bold">{activeAssignment.title}</h2>
            <p className="text-xs text-sky-200">
              Sender: <span className="font-semibold text-white">{activeAssignment.sender}</span> · Currently Active in:{' '}
              <span className="font-semibold text-white">{currentStage?.department || 'Archival'}</span> ({currentStage?.owner || 'Registry'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedAssignment(activeAssignment)}
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20"
            >
              Full Preview & Files
            </button>
            <button
              type="button"
              onClick={handleReassignLead}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >
              Delegate Lead
            </button>
            <button
              type="button"
              onClick={handleSendBack}
              className="rounded-xl border border-amber-400/30 bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/30"
            >
              Send Back (Query)
            </button>
            <button
              type="button"
              onClick={handleExecutiveRecall}
              className="rounded-xl border border-rose-400/30 bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/30"
            >
              Executive Recall
            </button>
          </div>
        </div>
      </section>

      {/* Sequential Pipeline Cards */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Sequential Stage Progression</h2>
          <span className="text-xs text-slate-500">
            {activeAssignment.workflowStages.filter((s) => s.status === 'Completed').length} of{' '}
            {activeAssignment.workflowStages.length} Stages Completed
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activeAssignment.workflowStages.map((stage, idx) => {
            const isCurrent = idx === activeAssignment.currentStageIndex;
            const isCompleted = stage.status === 'Completed';

            return (
              <div
                key={stage.id || idx}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition duration-200 ${
                  isCurrent
                    ? 'border-sky-400 bg-sky-50/80 shadow-md ring-2 ring-sky-300'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/50'
                    : stage.status === 'Blocked'
                    ? 'border-rose-200 bg-rose-50/50'
                    : 'border-slate-200 bg-slate-50/70 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 shadow-sm">
                      Stage {idx + 1}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCurrent
                          ? 'bg-blue-100 text-blue-800 animate-pulse'
                          : stage.status === 'Blocked'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {stage.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900">{stage.name}</h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Dept: <strong className="text-slate-800">{stage.department}</strong>
                  </p>
                  <p className="text-xs text-slate-600">
                    Lead: <strong className="text-slate-800">{stage.owner}</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">SLA Target: {stage.slaDays} days</p>

                  {stage.requiredAction && (
                    <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-900">
                      <strong>Directive:</strong> {stage.requiredAction}
                    </div>
                  )}

                  {stage.notes && (
                    <p className="mt-2 text-xs italic text-slate-500">
                      Note: &ldquo;{stage.notes}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                  {isCompleted ? (
                    <span className="font-semibold text-emerald-700">✓ Signed off</span>
                  ) : isCurrent ? (
                    <button
                      type="button"
                      onClick={handleAdvanceStage}
                      className="rounded-lg bg-[#123b75] px-3 py-1.5 font-bold text-white shadow-sm hover:bg-[#0d2f5f]"
                    >
                      Sign off & Pass →
                    </button>
                  ) : (
                    <span className="text-slate-400">Awaiting prior stage</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discussion & Audit Log */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">Workflow Directives & Transition Audit</h3>
        <p className="text-xs text-slate-500 mb-4">Official log of departmental sign-offs, reassignments, and executive actions.</p>

        <div className="space-y-3">
          {activeAssignment.comments.length === 0 ? (
            <p className="text-xs text-slate-400">No notes recorded yet for this workflow.</p>
          ) : (
            activeAssignment.comments.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    {c.author} <span className="font-normal text-slate-500">({c.role})</span>
                  </span>
                  <span className="text-slate-400">{c.timestamp}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-700">{c.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
