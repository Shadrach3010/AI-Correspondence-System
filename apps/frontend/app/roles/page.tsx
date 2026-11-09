'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useICMS } from '../../store/icms-store';

const allPermissions = [
  'system_admin',
  'executive_oversight',
  'view_incoming',
  'approve_documents',
  'manage_departments',
  'view_reports',
  'approval_queue',
  'budget_review',
  'manage_procurement',
  'team_assignments',
  'case_updates',
  'notifications',
  'recall_workflow',
  'manage_policies',
];

export default function RolesPage() {
  const { roles, addRole, users } = useICMS();
  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: ['view_incoming', 'approval_queue'],
  });

  const handlePermissionToggle = (permission: string) => {
    setForm((current) => {
      const exists = current.permissions.includes(permission);
      return {
        ...current,
        permissions: exists
          ? current.permissions.filter((item) => item !== permission)
          : [...current.permissions, permission],
      };
    });
  };

  const handleCreateRole = async () => {
    if (!form.name.trim()) {
      await Swal.fire({
        title: 'Role Name Required',
        text: 'Please enter a name for the new role.',
        icon: 'warning',
        confirmButtonColor: '#123b75',
      });
      return;
    }

    addRole({
      name: form.name.trim(),
      description: form.description.trim() || 'Custom institutional access role.',
      permissions: form.permissions,
    });

    setForm({ name: '', description: '', permissions: ['view_incoming', 'approval_queue'] });

    await Swal.fire({
      title: 'Role Registered',
      text: `${form.name} was added to the institutional security catalog.`,
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Access Control</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Institutional Roles & Permissions</h1>
          <p className="mt-1 text-xs text-slate-500">
            Define granular authorization scopes for executive leadership, registry officers, and faculty administrators.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Configured Role Catalog</h2>
            <span className="text-xs text-slate-500">{roles.length} Roles Active</span>
          </div>

          <div className="space-y-4">
            {roles.map((role) => {
              const assignedUserCount = users.filter((u) => u.role === role.name).length;

              return (
                <div key={role.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-900">{role.name}</p>
                      <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{role.description}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
                      {assignedUserCount} Active Staff
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {role.permissions.map((p) => (
                      <span
                        key={`${role.name}-${p}`}
                        className="rounded-md bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-800"
                      >
                        {p.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Create Role */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] h-fit">
          <h2 className="text-lg font-bold text-slate-900">Define New Role</h2>
          <p className="text-xs text-slate-500 mb-4">Configure custom permission bundles.</p>

          <div className="space-y-4">
            <label className="block space-y-1 text-xs font-bold text-slate-700">
              Role Title
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                placeholder="e.g. Compliance Auditor"
              />
            </label>

            <label className="block space-y-1 text-xs font-bold text-slate-700">
              Description
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                placeholder="Institutional responsibilities of this role..."
                rows={3}
              />
            </label>

            <div>
              <p className="text-xs font-bold text-slate-700 mb-2">Granted Permissions</p>
              <div className="flex flex-wrap gap-1.5">
                {allPermissions.map((p) => {
                  const isChecked = form.permissions.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePermissionToggle(p)}
                      className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase transition ${
                        isChecked
                          ? 'border-sky-400 bg-sky-100 text-sky-900 shadow-sm'
                          : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {p.replace(/_/g, ' ')}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateRole}
              className="w-full rounded-full bg-[#123b75] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 transition hover:bg-[#0d2f5f]"
            >
              Save Access Role →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
