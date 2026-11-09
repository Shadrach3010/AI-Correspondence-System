'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useICMS } from '../../store/icms-store';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead, clearNotifications } = useICMS();
  const [filter, setFilter] = useState<'All' | 'Unread' | 'High'>('All');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'High') return n.priority === 'High';
    return true;
  });

  const handleMarkAll = async () => {
    markAllNotificationsRead();
    await Swal.fire({
      title: 'Alerts Marked Read',
      text: 'All pending notifications marked as acknowledged.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });
  };

  const handleClear = async () => {
    const result = await Swal.fire({
      title: 'Clear Notifications',
      text: 'Clear all notification entries from your feed?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Clear All',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#123b75',
    });

    if (result.isConfirmed) {
      clearNotifications();
    }
  };

  const handleNotificationClick = (item: typeof notifications[0]) => {
    markNotificationRead(item.id);
    if (item.linkHref) {
      router.push(item.linkHref);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">System Feed</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Institutional Alerts & Notifications</h1>
            <p className="mt-1 text-xs text-slate-500">
              Live updates on pending approvals, AI policy thresholds, and workflow advancements.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear Feed
            </button>
            <button
              type="button"
              onClick={handleMarkAll}
              className="rounded-full bg-[#123b75] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
            >
              Mark All as Read
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
        <div className="flex gap-2">
          {(['All', 'Unread', 'High'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
                filter === tab ? 'bg-[#123b75] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab} {tab === 'Unread' ? `(${notifications.filter((n) => !n.read).length})` : ''}
            </button>
          ))}
        </div>
      </section>

      {/* Notification List */}
      <section className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/80 p-12 text-center text-slate-500">
            <p className="text-sm font-semibold">No notifications matching your filter.</p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`cursor-pointer rounded-2xl border p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                item.read ? 'border-slate-200 bg-white/80' : 'border-sky-300 bg-sky-50/70 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!item.read && <span className="h-2.5 w-2.5 rounded-full bg-sky-600 animate-pulse" />}
                    <h2 className="text-base font-bold text-slate-900">{item.title}</h2>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.detail}</p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : item.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                </div>
              </div>

              {item.linkHref && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <span className="text-[11px] font-bold text-[#123b75] hover:underline">
                    View Correspondence in {item.linkHref.replace('/', '')} →
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
