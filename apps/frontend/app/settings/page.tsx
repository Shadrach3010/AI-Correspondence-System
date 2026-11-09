'use client';

import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { useICMS, UserProfile, SystemSettings } from '../../store/icms-store';

export default function SettingsPage() {
  const { settings, updateSettings, updateUserProfile, simulateIncomingEmail, resetToDefaults, departments } = useICMS();

  const [activeTab, setActiveTab] = useState<'profile' | 'institution' | 'ai' | 'sla' | 'notifications' | 'diagnostics'>('profile');

  const defaultProfile: UserProfile = {
    name: 'Dr. Ada Okafor',
    email: 'ada.okafor@university.edu',
    phone: '+234 803 123 4567',
    designation: 'Registrar & Chief Correspondence Officer',
    department: 'Registry',
    bio: 'Oversees university documentation, senate assembly records, and institutional academic governance.',
    avatarUrl: '',
    signatureText: 'Dr. Ada Okafor, PhD, FCIA\nRegistrar & Secretary to Senate\nUniversity of Excellence',
    twoFactorEnabled: true,
    themePreference: 'system',
    emailNotifications: true,
    pushNotifications: true,
    digestFrequency: 'daily',
  };

  const currentProf = settings?.userProfile || defaultProfile;

  // Profile Form State
  const [profileForm, setProfileForm] = useState<UserProfile>(currentProf);
  const [avatarPreview, setAvatarPreview] = useState<string>(currentProf.avatarUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if store settings change
  React.useEffect(() => {
    if (settings?.userProfile) {
      setProfileForm(settings.userProfile);
      setAvatarPreview(settings.userProfile.avatarUrl || '');
    }
  }, [settings?.userProfile]);

  // Password Change State
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  // Institution Form State
  const [instForm, setInstForm] = useState({
    institutionName: settings?.institutionName || 'University of Excellence',
    institutionMotto: settings?.institutionMotto || '',
    portalSubtitle: settings?.portalSubtitle || '',
    academicYear: settings?.academicYear || '2026 / 2027',
    term: settings?.term || 'Autumn Semester',
    contactEmail: settings?.contactEmail || 'registry@university.edu',
    supportHotline: settings?.supportHotline || '',
    workingHours: settings?.workingHours || '08:00 - 17:00',
    logoUrl: settings?.logoUrl || '',
  });

  // AI & Policy Form State
  const [aiThreshold, setAiThreshold] = useState<number>(settings?.aiThreshold ?? 95);
  const [aiModel, setAiModel] = useState<string>(settings?.aiModel || 'Gemini 2.5 Pro (Institutional Sovereign Engine)');
  const [emailIngestion, setEmailIngestion] = useState<boolean>(settings?.emailIngestionEnabled ?? true);
  const [autoEscalate, setAutoEscalate] = useState<boolean>(settings?.autoEscalateConfidential ?? true);

  // SLA Form State
  const [slaRules, setSlaRules] = useState(
    settings?.slaRules || {
      procurementDays: 7,
      governanceDays: 3,
      studentCaseDays: 5,
      generalDays: 4,
      legalDays: 2,
      escalationWarningHours: 24,
    }
  );

  // Notification Form State
  const [notifPreferences, setNotifPreferences] = useState({
    emailNotifications: currentProf.emailNotifications ?? true,
    pushNotifications: currentProf.pushNotifications ?? true,
    digestFrequency: currentProf.digestFrequency || 'daily',
  });

  // Handle Avatar Upload (Convert to base64 Data URL)
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      void Swal.fire({
        title: 'File Too Large',
        text: 'Please select an image smaller than 2MB.',
        icon: 'warning',
        confirmButtonColor: '#123b75',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setProfileForm((prev) => ({ ...prev, avatarUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    setProfileForm((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profileForm);

    await Swal.fire({
      title: 'Profile Updated',
      text: 'Your officer credentials, bio, and avatar have been saved.',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.newPass) {
      await Swal.fire({
        title: 'Missing Fields',
        text: 'Please enter both current and new password.',
        icon: 'warning',
        confirmButtonColor: '#123b75',
      });
      return;
    }

    if (passwords.newPass !== passwords.confirm) {
      await Swal.fire({
        title: 'Password Mismatch',
        text: 'New password and confirmation do not match.',
        icon: 'error',
        confirmButtonColor: '#123b75',
      });
      return;
    }

    setPasswords({ current: '', newPass: '', confirm: '' });
    await Swal.fire({
      title: 'Password Changed',
      text: 'Institutional authentication credentials successfully updated.',
      icon: 'success',
      confirmButtonColor: '#123b75',
    });
  };

  const handleSaveInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...instForm,
    });

    await Swal.fire({
      title: 'Institutional Settings Saved',
      text: 'University identity, branding, and academic calendar updated.',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleSaveAiGovernance = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      aiThreshold,
      aiModel,
      emailIngestionEnabled: emailIngestion,
      autoEscalateConfidential: autoEscalate,
    });

    await Swal.fire({
      title: 'AI Policy Updated',
      text: `Routing threshold set to ${aiThreshold}%. Governance precedence enforced.`,
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleSaveSla = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ slaRules });

    await Swal.fire({
      title: 'SLA Durations Updated',
      text: 'Departmental SLA targets and escalation thresholds configured.',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(notifPreferences);

    await Swal.fire({
      title: 'Alert Preferences Saved',
      text: 'Dispatch frequencies and notification channels updated.',
      icon: 'success',
      timer: 1600,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleExportConfig = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `icms-config-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: 'Reset to Factory Defaults',
      text: 'This will restore all departments, users, assignments, and settings to original initial state.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Reset Demo Data',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#991b1b',
    });

    if (result.isConfirmed) {
      resetToDefaults();
      setProfileForm(settings.userProfile);
      setAvatarPreview('');
      setAiThreshold(95);

      await Swal.fire({
        title: 'System Reset Completed',
        text: 'All records and configuration restored to baseline.',
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
      {/* Page Header */}
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Administration Center</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">System & Profile Settings</h1>
            <p className="mt-1 text-xs text-slate-500">
              Manage your personal officer profile, institutional branding, AI confidence thresholds, and SLA rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportConfig}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Export Config JSON
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm">
        <div className="flex flex-wrap gap-1.5 text-xs font-bold">
          {(
            [
              { id: 'profile', label: '👤 Profile & Credentials' },
              { id: 'institution', label: '🏛 University Identity' },
              { id: 'ai', label: '⚡ AI & Routing Engine' },
              { id: 'sla', label: '⏱ SLA Policies' },
              { id: 'notifications', label: '🔔 Alerts & Notifications' },
              { id: 'diagnostics', label: '🛠 Diagnostics & Tools' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 transition ${
                activeTab === tab.id
                  ? 'bg-[#123b75] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab 1: Profile & Credentials */}
      {activeTab === 'profile' && (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Personal Info & Avatar Form */}
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Officer Profile Information</h2>
                <p className="text-xs text-slate-500">Your profile details appear on correspondence reviews and digital sign-offs.</p>
              </div>

              {/* Avatar Upload Component */}
              <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-300 bg-slate-200 shadow-md">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="User Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xl font-black text-slate-700">
                      {profileForm.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <p className="text-xs font-bold text-slate-800">Profile Photo / Avatar</p>
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG or WebP up to 2MB.</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAvatarFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                      Upload New Photo
                    </button>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-bold text-slate-700">
                  Full Name
                  <input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                  />
                </label>

                <label className="space-y-1 text-xs font-bold text-slate-700">
                  Institutional Email
                  <input
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-bold text-slate-700">
                  Official Designation / Title
                  <input
                    value={profileForm.designation}
                    onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                  />
                </label>

                <label className="space-y-1 text-xs font-bold text-slate-700">
                  Primary Department
                  <select
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-bold text-slate-700">
                  Official Phone / Extension
                  <input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                  />
                </label>

                <label className="space-y-1 text-xs font-bold text-slate-700">
                  Theme Interface
                  <select
                    value={profileForm.themePreference}
                    onChange={(e) => setProfileForm({ ...profileForm, themePreference: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                  >
                    <option value="system">Institutional Default (Light / Navy)</option>
                    <option value="light">Crisp Modern Light</option>
                    <option value="dark">Executive Deep Navy Dark</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-1 text-xs font-bold text-slate-700">
                Official Office Bio & Terms
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>

              <label className="block space-y-1 text-xs font-bold text-slate-700">
                Digital Signature Text & Seal
                <textarea
                  rows={3}
                  value={profileForm.signatureText}
                  onChange={(e) => setProfileForm({ ...profileForm, signatureText: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white font-mono text-[11px]"
                />
              </label>

              <button
                type="submit"
                className="rounded-full bg-[#123b75] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
              >
                Save Profile Changes →
              </button>
            </form>
          </section>

          {/* Security, Password & 2FA */}
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Security & Authentication</h2>
              <p className="text-xs text-slate-500 mb-4">Manage access credentials and multi-factor authorization.</p>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <label className="block space-y-1 text-xs font-bold text-slate-700">
                  Current Password
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                    placeholder="••••••••••••"
                  />
                </label>

                <label className="block space-y-1 text-xs font-bold text-slate-700">
                  New Password
                  <input
                    type="password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                    placeholder="Minimum 8 characters"
                  />
                </label>

                <label className="block space-y-1 text-xs font-bold text-slate-700">
                  Confirm New Password
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                    placeholder="Repeat new password"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Update Password
                </button>
              </form>

              {/* Two-Factor Toggle */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500">Enforce OTP verification for approval workflows.</p>
                </div>
                <input
                  type="checkbox"
                  checked={profileForm.twoFactorEnabled}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setProfileForm({ ...profileForm, twoFactorEnabled: checked });
                    updateUserProfile({ twoFactorEnabled: checked });
                  }}
                  className="h-4 w-4 rounded accent-[#123b75]"
                />
              </div>
            </div>

            {/* Active Sessions */}
            <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Authorized Sessions</h3>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Chrome / Windows (Current Device)</span>
                  <span className="text-emerald-600">Active Now</span>
                </div>
                <p className="text-[11px] text-slate-500">IP: 192.168.1.104 · University Admin Subnet</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  Swal.fire({
                    title: 'Sessions Terminated',
                    text: 'All other active session tokens have been revoked.',
                    icon: 'info',
                    timer: 1400,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end',
                  })
                }
                className="w-full rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
              >
                Revoke All Other Sessions
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Tab 2: University Identity */}
      {activeTab === 'institution' && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm max-w-4xl">
          <form onSubmit={handleSaveInstitution} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Institutional Identity & Calendar</h2>
              <p className="text-xs text-slate-500">Configure public headers, official contact desks, and term dates.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-bold text-slate-700">
                University / Institution Name
                <input
                  value={instForm.institutionName}
                  onChange={(e) => setInstForm({ ...instForm, institutionName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Portal Subtitle / System Title
                <input
                  value={instForm.portalSubtitle}
                  onChange={(e) => setInstForm({ ...instForm, portalSubtitle: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>
            </div>

            <label className="block space-y-1 text-xs font-bold text-slate-700">
              Institutional Motto
              <input
                value={instForm.institutionMotto}
                onChange={(e) => setInstForm({ ...instForm, institutionMotto: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-bold text-slate-700">
                Academic Year
                <input
                  value={instForm.academicYear}
                  onChange={(e) => setInstForm({ ...instForm, academicYear: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Current Semester / Term
                <input
                  value={instForm.term}
                  onChange={(e) => setInstForm({ ...instForm, term: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-1 text-xs font-bold text-slate-700">
                Official Registry Inbound Mailbox
                <input
                  value={instForm.contactEmail}
                  onChange={(e) => setInstForm({ ...instForm, contactEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Registry Helpline
                <input
                  value={instForm.supportHotline}
                  onChange={(e) => setInstForm({ ...instForm, supportHotline: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Official Operating Hours
                <input
                  value={instForm.workingHours}
                  onChange={(e) => setInstForm({ ...instForm, workingHours: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                />
              </label>
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#123b75] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
            >
              Save University Settings →
            </button>
          </form>
        </section>
      )}

      {/* Tab 3: AI & Routing Engine */}
      {activeTab === 'ai' && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm max-w-4xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Intelligence & Automated Routing Policies</h2>
            <p className="text-xs text-slate-500">Tune Gemini natural language document understanding parameters and confidence levels.</p>
          </div>

          <form onSubmit={handleSaveAiGovernance} className="space-y-6">
            {/* Threshold Slider Card */}
            <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-sky-900">Automated Route Confidence Threshold</h3>
                  <p className="text-xs text-slate-600">
                    If AI confidence is $\ge {aiThreshold}\%$, correspondence is eligible for automated departmental dispatch.
                  </p>
                </div>
                <span className="rounded-full bg-[#123b75] px-3.5 py-1 text-sm font-bold text-white shadow-sm">
                  {aiThreshold}%
                </span>
              </div>

              <input
                type="range"
                min="50"
                max="99"
                value={aiThreshold}
                onChange={(e) => setAiThreshold(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#123b75]"
              />

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>50% (Permissive)</span>
                <span className="font-bold text-[#123b75]">95% (University Mandate per ADR-002)</span>
                <span>99% (Strict Review)</span>
              </div>
            </div>

            {/* Model & Ingestion */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-xs font-bold text-slate-700">
                AI NLP Reasoning Engine
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="Gemini 2.5 Pro (Institutional Sovereign Engine)">Gemini 2.5 Pro (Institutional Sovereign Engine)</option>
                  <option value="Gemini 2.5 Flash (Ultra-Low Latency Triage)">Gemini 2.5 Flash (Ultra-Low Latency Triage)</option>
                  <option value="Institutional On-Premise Sovereign Model">Institutional On-Premise Sovereign Model</option>
                </select>
              </label>

              <div className="flex flex-col justify-center space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Email Server Polling & Ingestion</span>
                  <input
                    type="checkbox"
                    checked={emailIngestion}
                    onChange={(e) => setEmailIngestion(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#123b75]"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Automatically poll institutional IMAP/Exchange mailbox.</p>
              </div>
            </div>

            {/* Confidentiality Precedence Rule */}
            <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
              <div>
                <p className="text-xs font-bold text-amber-900">Institutional Policy Precedence Override (ADR-002)</p>
                <p className="text-[11px] text-amber-700">
                  Force manual human review for Senate, Council, or disciplinary correspondence regardless of AI confidence.
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="h-4 w-4 rounded accent-[#123b75]"
              />
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#123b75] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
            >
              Apply AI Policy Settings →
            </button>
          </form>
        </section>
      )}

      {/* Tab 4: SLA Policies */}
      {activeTab === 'sla' && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm max-w-4xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Service Level Agreement (SLA) Targets</h2>
            <p className="text-xs text-slate-500">Specify maximum turnaround duration per correspondence classification.</p>
          </div>

          <form onSubmit={handleSaveSla} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="space-y-1 text-xs font-bold text-slate-700">
                Procurement & Tenders (Days)
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={slaRules.procurementDays}
                  onChange={(e) => setSlaRules({ ...slaRules, procurementDays: parseInt(e.target.value, 10) || 7 })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Governance & Senate (Days)
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={slaRules.governanceDays}
                  onChange={(e) => setSlaRules({ ...slaRules, governanceDays: parseInt(e.target.value, 10) || 3 })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Student Grievances (Days)
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={slaRules.studentCaseDays}
                  onChange={(e) => setSlaRules({ ...slaRules, studentCaseDays: parseInt(e.target.value, 10) || 5 })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Legal & Subpoenas (Days)
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={slaRules.legalDays}
                  onChange={(e) => setSlaRules({ ...slaRules, legalDays: parseInt(e.target.value, 10) || 2 })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                General Administration (Days)
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={slaRules.generalDays}
                  onChange={(e) => setSlaRules({ ...slaRules, generalDays: parseInt(e.target.value, 10) || 4 })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                />
              </label>

              <label className="space-y-1 text-xs font-bold text-slate-700">
                Escalation Warning (Hours Before Breach)
                <input
                  type="number"
                  min="1"
                  max="72"
                  value={slaRules.escalationWarningHours}
                  onChange={(e) => setSlaRules({ ...slaRules, escalationWarningHours: parseInt(e.target.value, 10) || 24 })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                />
              </label>
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#123b75] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
            >
              Save SLA Rules →
            </button>
          </form>
        </section>
      )}

      {/* Tab 5: Alerts & Notifications */}
      {activeTab === 'notifications' && (
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm max-w-4xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Notification & Alert Preferences</h2>
            <p className="text-xs text-slate-500">Configure how and when the system alerts you regarding correspondence tasks.</p>
          </div>

          <form onSubmit={handleSaveNotifications} className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-bold text-slate-800">Email Notification Relays</p>
                  <p className="text-[11px] text-slate-500">Receive email alerts for direct case assignments and mentions.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifPreferences.emailNotifications}
                  onChange={(e) => setNotifPreferences({ ...notifPreferences, emailNotifications: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#123b75]"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-bold text-slate-800">Desktop & In-App Toast Banners</p>
                  <p className="text-[11px] text-slate-500">Display popup banners for urgent workflow advancements.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifPreferences.pushNotifications}
                  onChange={(e) => setNotifPreferences({ ...notifPreferences, pushNotifications: e.target.checked })}
                  className="h-4 w-4 rounded accent-[#123b75]"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-bold text-slate-800">Executive Summary Digest Schedule</p>
                  <p className="text-[11px] text-slate-500">Frequency of consolidated pending caseload summaries.</p>
                </div>
                <select
                  value={notifPreferences.digestFrequency}
                  onChange={(e) => setNotifPreferences({ ...notifPreferences, digestFrequency: e.target.value as any })}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="immediate">Immediate Push</option>
                  <option value="daily">Daily Morning Digest (08:00 AM)</option>
                  <option value="weekly">Weekly Friday Roundup</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#123b75] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
            >
              Save Alert Preferences →
            </button>
          </form>
        </section>
      )}

      {/* Tab 6: Diagnostics & Tools */}
      {activeTab === 'diagnostics' && (
        <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Simulation & Intake Diagnostics</h2>
            <p className="text-xs text-slate-500">Trigger test correspondence items to verify pipeline throughput.</p>

            <button
              type="button"
              onClick={() => {
                simulateIncomingEmail();
                void Swal.fire({
                  title: 'Email Ingestion Simulated',
                  text: 'A sample academic correspondence was placed in the queue and triaged by AI.',
                  icon: 'info',
                  confirmButtonColor: '#123b75',
                });
              }}
              className="w-full rounded-2xl border border-sky-300 bg-sky-50 p-4 text-left transition hover:bg-sky-100"
            >
              <p className="text-xs font-bold text-sky-900">✉ Ingest Sample University Email</p>
              <p className="mt-1 text-[11px] text-slate-600">Simulates receiving a real research or procurement email.</p>
            </button>

            <button
              type="button"
              onClick={handleExportConfig}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:bg-slate-100"
            >
              <p className="text-xs font-bold text-slate-800">💾 Download Institutional Config Backup</p>
              <p className="mt-1 text-[11px] text-slate-500">Exports all policies, SLA parameters, and profile details to JSON.</p>
            </button>
          </section>

          <section className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-rose-900">Factory Reset & Cache Purge</h2>
            <p className="text-xs text-slate-600">
              Clear local storage adjustments and restore default university departments, demo assignments, and settings.
            </p>

            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-full border border-rose-300 bg-white px-5 py-3 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-50"
            >
              Reset All Data to Baseline
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
