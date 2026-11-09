'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useICMS, Department } from '../../store/icms-store';

export default function DepartmentsPage() {
  const { departments, assignments, addDepartment, updateDepartment } = useICMS();
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);

  const handleAddDepartment = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Register New Institutional Department',
      html: `
        <div style="text-align:left; font-size:14px; display:flex; flex-direction:column; gap:12px;">
          <label><strong>Department Name:</strong>
            <input id="swal-dept-name" class="swal2-input" placeholder="e.g. Legal Affairs & Compliance" style="width:100%; margin-top:4px;" />
          </label>
          <label><strong>Department Code:</strong>
            <input id="swal-dept-code" class="swal2-input" placeholder="e.g. LAC" style="width:100%; margin-top:4px;" />
          </label>
          <label><strong>Department Head:</strong>
            <input id="swal-dept-head" class="swal2-input" placeholder="e.g. Barr. Grace Okon" style="width:100%; margin-top:4px;" />
          </label>
          <label><strong>Staff Count:</strong>
            <input id="swal-dept-staff" type="number" value="6" class="swal2-input" style="width:100%; margin-top:4px;" />
          </label>
          <label><strong>Description / Mandate:</strong>
            <textarea id="swal-dept-desc" class="swal2-textarea" placeholder="Institutional scope..." style="width:100%; margin-top:4px; height:60px;"></textarea>
          </label>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Register Unit',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
      preConfirm: () => {
        const name = (document.getElementById('swal-dept-name') as HTMLInputElement)?.value;
        const code = (document.getElementById('swal-dept-code') as HTMLInputElement)?.value;
        const head = (document.getElementById('swal-dept-head') as HTMLInputElement)?.value;
        const staff = parseInt((document.getElementById('swal-dept-staff') as HTMLInputElement)?.value || '1', 10);
        const description = (document.getElementById('swal-dept-desc') as HTMLTextAreaElement)?.value;
        if (!name || !code) {
          Swal.showValidationMessage('Name and code are required');
          return null;
        }
        return { name, code, head, staff, description };
      },
    });

    if (formValues) {
      addDepartment({
        name: formValues.name,
        code: formValues.code,
        head: formValues.head || 'Unassigned',
        staff: formValues.staff,
        cases: 0,
        status: 'Stable',
        slaAdherence: 95,
        description: formValues.description || 'Institutional department unit.',
      });

      await Swal.fire({
        title: 'Department Registered',
        text: `${formValues.name} (${formValues.code}) is now active in ICMS.`,
        icon: 'success',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">Organization</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Operational Units & Faculties</h1>
            <p className="mt-1 text-xs text-slate-500">
              Departmental units handling assigned workflows, case tracking, and SLA compliance.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddDepartment}
            className="rounded-full bg-[#123b75] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-900/15 transition hover:bg-[#0d2f5f]"
          >
            + Register Department
          </button>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((department) => {
          const liveCases = assignments.filter((a) => a.department === department.name && a.status !== 'Completed').length;

          return (
            <div
              key={department.name}
              className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">{department.code}</span>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">{department.name}</h2>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                    department.status === 'Busy'
                      ? 'bg-amber-100 text-amber-800'
                      : department.status === 'Monitoring'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {department.status}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500 line-clamp-2">{department.description}</p>
              <p className="mt-1 text-xs text-slate-700">Head of Unit: <strong>{department.head}</strong></p>

              <div className="mt-5 space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Assigned Personnel</span>
                  <span className="font-bold text-slate-900">{department.staff} Officers</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Active Live Caseload</span>
                  <span className="font-bold text-sky-900">{liveCases} Cases Active</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>SLA Adherence</span>
                  <span className="font-bold text-emerald-600">{department.slaAdherence}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
