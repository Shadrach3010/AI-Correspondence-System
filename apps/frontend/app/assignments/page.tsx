'use client';

import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { useICMS, Assignment } from '../../store/icms-store';

export default function AssignmentsPage() {
  const { assignments, advanceAssignmentWorkflow, setSelectedAssignment, departments } = useICMS();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.correspondenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        statusFilter === 'All'
          ? true
          : statusFilter === 'High Risk'
          ? item.risk === 'High'
          : item.status === statusFilter;

      const matchDept = deptFilter === 'All' || item.department === deptFilter;

      return matchSearch && matchStatus && matchDept;
    });
  }, [assignments, searchTerm, statusFilter, deptFilter]);

  const handleQuickAdvance = async (e: React.MouseEvent, assignment: Assignment) => {
    e.stopPropagation();
    const curStage = assignment.workflowStages[assignment.currentStageIndex];

    const result = await Swal.fire({
      title: 'Advance Workflow Stage',
      text: `Sign off "${curStage?.name || assignment.title}" and transition to next department?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Advance Stage',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (result.isConfirmed) {
      advanceAssignmentWorkflow(assignment.id);
      await Swal.fire({
        title: 'Stage Advanced',
        text: 'The correspondence has successfully transitioned.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">Assignments</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Active Work & Delegations</h1>
            <p className="mt-1 text-xs text-slate-500">
              Click any correspondence item to preview full details, attachments, AI confidence, and workflow history.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800">
              {assignments.filter((a) => a.status === 'Open' || a.status === 'In Review').length} Active Cases
            </span>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assignments by subject, reference #, owner, or department..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
              {['All', 'Open', 'In Review', 'High Risk', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`rounded-lg px-3 py-1 font-medium transition ${
                    statusFilter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Assignment List */}
      <section className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-12 text-center text-slate-500">
            <p className="text-base font-semibold">No assignments matched your search filters.</p>
            <p className="mt-1 text-xs">Try clearing search terms or changing department filters.</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const currentStage = assignment.workflowStages[assignment.currentStageIndex];

            return (
              <div
                key={assignment.id}
                onClick={() => setSelectedAssignment(assignment)}
                className="group relative cursor-pointer rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_20px_35px_rgba(17,24,39,0.1)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        {assignment.correspondenceId}
                      </span>
                      <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[11px] font-bold text-sky-800">
                        {assignment.category}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                          assignment.risk === 'High'
                            ? 'bg-rose-100 text-rose-800'
                            : assignment.risk === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {assignment.risk} Risk
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                          assignment.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : assignment.status === 'In Review'
                            ? 'bg-sky-100 text-sky-800'
                            : assignment.status === 'Recalled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-[#123b75]">
                      {assignment.title}
                    </h2>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {assignment.body}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <span>
                        Lead: <strong className="text-slate-900">{assignment.owner}</strong> ({assignment.department})
                      </span>
                      <span>•</span>
                      <span>
                        Current Stage:{' '}
                        <strong className="text-sky-800">
                          {currentStage?.name || 'Workflow Finished'} (Stage {Math.min(assignment.currentStageIndex + 1, assignment.workflowStages.length)}/{assignment.workflowStages.length})
                        </strong>
                      </span>
                      <span>•</span>
                      <span className="text-rose-600 font-semibold">Due: {assignment.due}</span>
                      {assignment.attachments?.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500 font-medium">{assignment.attachments.length} attachment(s)</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end lg:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAssignment(assignment);
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                    >
                      Inspect Preview
                    </button>

                    {assignment.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdvance(e, assignment)}
                        className="rounded-xl bg-[#123b75] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[#0d2f5f]"
                      >
                        Advance Stage →
                      </button>
                    )}
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
