'use client';

import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { useICMS, UserRecord } from '../../store/icms-store';

export default function UsersPage() {
  const { users, addUser, toggleUserStatus, deleteUser, departments, roles } = useICMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: roles[0]?.name || 'Registry Officer',
    department: departments[0]?.name || 'Registry',
    status: 'Active' as UserRecord['status'],
  });

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = deptFilter === 'All' || u.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [users, searchTerm, deptFilter]);

  const totalActive = useMemo(() => users.filter((user) => user.status === 'Active').length, [users]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreateUser = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      await Swal.fire({
        title: 'Missing Required Details',
        text: 'Please provide both user full name and institutional email address.',
        icon: 'warning',
        confirmButtonColor: '#123b75',
      });
      return;
    }

    addUser({
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      department: form.department,
      status: form.status,
    });

    setForm({
      name: '',
      email: '',
      role: roles[0]?.name || 'Registry Officer',
      department: departments[0]?.name || 'Registry',
      status: 'Active',
    });

    await Swal.fire({
      title: 'User Account Created',
      text: `${form.name} was successfully provisioned in ${form.department}.`,
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleToggleStatus = async (id: number, currentStatus: string, name: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const result = await Swal.fire({
      title: 'Modify Account Access',
      text: `Switch status for ${name} to ${nextStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm Status Change',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (result.isConfirmed) {
      toggleUserStatus(id);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Access Management</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Institutional Users Directory</h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage accounts, departmental assignments, and role permissions across all faculties.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800">
            {totalActive} of {users.length} Active Accounts
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">User Roster</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff..."
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:border-sky-500"
              />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between transition hover:bg-slate-100/70"
              >
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                    <span className="rounded-md bg-sky-100 px-2 py-0.5 font-bold text-sky-800">{user.role}</span>
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 font-medium text-slate-700">{user.department}</span>
                    <span
                      className={`rounded-md px-2 py-0.5 font-bold ${
                        user.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : user.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(user.id, user.status, user.name)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {user.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteUser(user.id)}
                    className="rounded-xl p-1.5 text-slate-400 hover:text-rose-600"
                    title="Remove user"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add User Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] h-fit">
          <h2 className="text-lg font-bold text-slate-900">Provision Account</h2>
          <p className="text-xs text-slate-500 mb-4">Add a new university staff profile to ICMS.</p>

          <div className="space-y-4">
            <label className="block space-y-1 text-xs font-bold text-slate-700">
              Full Name
              <input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                placeholder="Dr. Samuel Bello"
              />
            </label>

            <label className="block space-y-1 text-xs font-bold text-slate-700">
              Institutional Email
              <input
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                placeholder="samuel.bello@university.edu"
              />
            </label>

            <label className="block space-y-1 text-xs font-bold text-slate-700">
              Assigned Role
              <select
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
              >
                {roles.map((r) => (
                  <option key={r.name} value={r.name}>{r.name}</option>
                ))}
              </select>
            </label>

            <label className="block space-y-1 text-xs font-bold text-slate-700">
              Department
              <select
                value={form.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
              >
                {departments.map((d) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={handleCreateUser}
              className="w-full rounded-full bg-[#123b75] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 transition hover:bg-[#0d2f5f]"
            >
              Provision Account →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
