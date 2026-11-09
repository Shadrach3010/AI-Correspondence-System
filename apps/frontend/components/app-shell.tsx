'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useState } from 'react';

type IconProps = { className?: string };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9.5V20h14V9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 19V5M10 19V9M16 19v-7M22 19V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InboxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v7A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 14h4l2 3h4l2-3h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BuildingIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 20V7.8A1.8 1.8 0 0 1 5.8 6h12.4A1.8 1.8 0 0 1 20 7.8V20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M9 18h.01M15 18h.01" strokeLinecap="round" />
    </svg>
  );
}

function ClipboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M9 4h6a2 2 0 0 1 2 2v1h2a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11h6M9 15h6" strokeLinecap="round" />
    </svg>
  );
}

function WorkflowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="12" cy="18" r="2.2" />
      <path d="M8 6h8M7.5 7.5l3.5 8M16.5 7.5l-3.5 8" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 2 14.4 8.6 21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 3v2M19 4h-2M5 17v2M6 18H4" strokeLinecap="round" />
    </svg>
  );
}

function FileIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 3.5h7l5 5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 3.5V9h5M9 13h6M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M6 10a6 6 0 1 1 12 0v5l2 3H4l2-3v-5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20a2 2 0 0 0 4 0" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3.5v2.2m0 14.6v2.2M4.9 4.9l1.6 1.6m11 11l1.6 1.6M3.5 12h2.2m14.6 0h2.2M4.9 19.1l1.6-1.6m11-11l1.6-1.6M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PanelCloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4v16M15 11l-3-3 3-3M15 13l-3 3 3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PanelOpenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4v16M15 8l3 4-3 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 18.5h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

import { useICMS } from '../store/icms-store';

const navItems = [
  { label: 'Overview', href: '/', icon: HomeIcon },
  { label: 'Dashboard', href: '/dashboard', icon: BarChartIcon },
  { label: 'Incoming Items', href: '/incoming-items', icon: InboxIcon },
  { label: 'Departments', href: '/departments', icon: BuildingIcon },
  { label: 'Assignments', href: '/assignments', icon: ClipboardIcon },
  { label: 'Workflow', href: '/workflow', icon: WorkflowIcon },
  { label: 'AI Review', href: '/ai-review', icon: SparklesIcon },
  { label: 'Reports', href: '/reports', icon: FileIcon },
  { label: 'Users', href: '/users', icon: BuildingIcon },
  { label: 'Roles', href: '/roles', icon: SettingsIcon },
  { label: 'Notifications', href: '/notifications', icon: BellIcon },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

function downloadCsv(rows: string[][], filename: string) {
  const csvContent = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const { notifications, assignments, incomingItems, simulateIncomingEmail, settings } = useICMS();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const showFeedback = async (title: string, text: string, icon: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    await Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#123b75',
      timer: 2200,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleExport = async () => {
    const result = await Swal.fire({
      title: 'Export Operations Overview',
      text: `Download live operations report containing ${assignments.length} assignments and ${incomingItems.length} intake records as CSV?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Download CSV',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (!result.isConfirmed) {
      return;
    }

    const data: string[][] = [
      ['Type', 'ID / Ref', 'Subject', 'Department', 'Owner', 'Status', 'Priority', 'SLA / Due'],
      ...assignments.map((a) => ['Assignment', a.id, a.title, a.department, a.owner, a.status, a.priority, a.due]),
      ...incomingItems.map((i) => ['Incoming Item', i.id, i.subject, i.aiAnalysis?.recommendedDepartment || 'Registry', i.sender, i.status, i.priority, new Date(i.createdAt).toLocaleDateString()]),
    ];

    downloadCsv(data, `icms-operations-report-${new Date().toISOString().slice(0, 10)}.csv`);
    await showFeedback('Export complete', 'Live institutional operations report downloaded.', 'success');
  };

  const handleSimulateEmail = () => {
    simulateIncomingEmail();
    void showFeedback('Simulated Email Ingested', 'New incoming email received in mailbox and triaged by AI.', 'info');
  };

  const handleNewIntake = async () => {
    const result = await Swal.fire({
      title: 'Create new intake',
      text: 'Open the intake form to capture a new incoming item?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Open form',
      cancelButtonText: 'Stay here',
      confirmButtonColor: '#123b75',
    });

    if (!result.isConfirmed) {
      return;
    }

    router.push('/incoming-items/new');
  };

  return (
    <div className="min-h-screen">
      <aside className={`fixed inset-y-0 left-0 border-r border-slate-200 bg-[#0f172a] text-slate-50 shadow-2xl shadow-slate-900/15 transition-all duration-300 z-40 ${collapsed ? 'w-24' : 'w-72'}`}>
        <div className="border-b border-slate-700/80 px-4 py-5">
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37] text-sm font-black text-slate-900 shadow-lg shadow-amber-300/30">
              {collapsed ? 'U' : 'UN'}
            </div>
            {!collapsed && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-sky-300">ICMS</p>
                <h2 className="text-lg font-bold leading-tight">University</h2>
                <p className="text-xs text-slate-300">Operations Portal</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-2">
          <button
            type="button"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((value) => !value)}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/60 px-2 py-2.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
          >
            {collapsed ? <PanelOpenIcon className="h-4 w-4" /> : <PanelCloseIcon className="h-4 w-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            const isNotif = label === 'Notifications';

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? 'bg-slate-800 text-white shadow-inner shadow-sky-950/20' : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
                title={label}
              >
                <div className="flex items-center">
                  <Icon className={`h-4 w-4 ${collapsed ? '' : 'mr-2'}`} />
                  {!collapsed && label}
                </div>
                {!collapsed && isNotif && unreadCount > 0 && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-slate-700 bg-slate-800/80 p-4 shadow-lg shadow-slate-950/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Academic year</p>
            <p className="mt-2 text-lg font-semibold text-white">2026 / 2027</p>
            <p className="mt-1 text-xs text-slate-300">Term: Autumn semester</p>
          </div>
        )}
      </aside>

      <div className={`min-h-screen transition-all duration-300 ${collapsed ? 'ml-24' : 'ml-72'}`}>
        <header className="border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0 z-30">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">University of Excellence</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Correspondence Management</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSimulateEmail}
                title="Simulate receiving an incoming email into the mailbox"
                className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50/80 px-3.5 py-1.5 text-xs font-semibold text-sky-800 transition hover:bg-sky-100"
              >
                <SparklesIcon className="h-3.5 w-3.5 text-sky-600" />
                Simulate Incoming Mail
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
              >
                <DownloadIcon className="h-4 w-4" />
                Export
              </button>
              <button
                type="button"
                onClick={handleNewIntake}
                className="inline-flex items-center gap-2 rounded-full bg-[#123b75] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-sky-900/20 transition hover:bg-[#0d2f5f]"
              >
                <PlusIcon className="h-4 w-4" />
                New intake
              </button>

              {/* Profile Link Header Chip */}
              {(() => {
                const profile = settings?.userProfile;
                const avatar = profile?.avatarUrl || '';
                const name = profile?.name || 'Dr. Ada Okafor';
                const designation = profile?.designation || 'Registrar';
                const initials = name
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase() || 'AO';

                return (
                  <Link
                    href="/settings"
                    title="Manage Profile & Settings"
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:border-sky-300 hover:bg-slate-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-[#123b75] text-[11px] font-bold text-white shadow-sm shrink-0">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-[11px] font-bold text-slate-800 leading-tight">{name}</p>
                      <p className="text-[9px] text-slate-500 leading-tight">{designation.split('&')[0]}</p>
                    </div>
                  </Link>
                );
              })()}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
