'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { useICMS, PriorityLevel } from '../../../store/icms-store';

export default function NewIncomingItemPage() {
  const router = useRouter();
  const { addIncomingItem } = useICMS();

  const [form, setForm] = useState({
    subject: '',
    sender: '',
    body: '',
    source: 'Email' as 'Email' | 'Manual upload' | 'Portal' | 'Scanned',
    priority: 'Medium' as PriorityLevel,
  });

  const [attachments, setAttachments] = useState<Array<{ name: string; size: string; type: string }>>([]);
  const [attachmentInput, setAttachmentInput] = useState('');

  const handleAddAttachment = () => {
    if (!attachmentInput.trim()) return;
    setAttachments((prev) => [
      ...prev,
      {
        name: attachmentInput.trim(),
        size: '1.4 MB',
        type: attachmentInput.endsWith('.pdf') ? 'PDF' : 'Document',
      },
    ]);
    setAttachmentInput('');
  };

  const handleRemoveAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((a) => a.name !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.subject.trim() || !form.sender.trim()) {
      await Swal.fire({
        title: 'Missing Required Fields',
        text: 'Please provide both the correspondence subject and sender information.',
        icon: 'warning',
        confirmButtonColor: '#123b75',
      });
      return;
    }

    const newItem = addIncomingItem({
      subject: form.subject.trim(),
      sender: form.sender.trim(),
      body: form.body.trim() || 'No body content provided.',
      source: form.source,
      priority: form.priority,
      status: 'AI REVIEW',
      attachments,
    });

    await Swal.fire({
      title: 'Intake Captured & Triaged',
      text: `Correspondence #${newItem.id} has been registered. AI categorized as ${newItem.aiAnalysis?.category} (${newItem.aiAnalysis?.confidence}% confidence).`,
      icon: 'success',
      confirmButtonColor: '#123b75',
    });

    router.push('/incoming-items');
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700">Intake Ingestion</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Capture Incoming Correspondence</h1>
        <p className="mt-1 text-xs text-slate-500">
          Simulate email intake or manually upload letters, petitions, and memos to trigger automated AI classification.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-xs font-bold text-slate-700">
                Correspondence Source
                <select
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="Email">University Designated Mailbox (Email)</option>
                  <option value="Manual upload">Manual Document Upload</option>
                  <option value="Portal">Institutional Portal Form</option>
                  <option value="Scanned">Scanned Physical Dispatch</option>
                </select>
              </label>

              <label className="space-y-1.5 text-xs font-bold text-slate-700">
                Initial Priority
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="High">High (Immediate Triage)</option>
                  <option value="Medium">Medium (Standard SLA)</option>
                  <option value="Low">Low (Informational)</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1.5 text-xs font-bold text-slate-700">
              Sender Address / Identification
              <input
                type="text"
                value={form.sender}
                onChange={(e) => setForm({ ...form, sender: e.target.value })}
                placeholder="e.g. labs-procure@university.edu or student.union@university.edu"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:bg-white"
              />
            </label>

            <label className="block space-y-1.5 text-xs font-bold text-slate-700">
              Subject / Reference Line
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Requisition for Research Mass Spectrometer Equipment"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:bg-white"
              />
            </label>

            <label className="block space-y-1.5 text-xs font-bold text-slate-700">
              Official Body Content / Letter Text
              <textarea
                rows={5}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Paste the message content, email body, or transcript of correspondence..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:bg-white"
              />
            </label>

            {/* Attachments simulator */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Attach Document Artifacts</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={attachmentInput}
                  onChange={(e) => setAttachmentInput(e.target.value)}
                  placeholder="e.g. Tender_Proposal_2026.pdf"
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  + Add File
                </button>
              </div>

              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {attachments.map((a) => (
                    <span
                      key={a.name}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs text-sky-900"
                    >
                      <span>📎 {a.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(a.name)}
                        className="text-rose-600 font-bold hover:text-rose-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => router.push('/incoming-items')}
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#123b75] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-900/15 hover:bg-[#0d2f5f]"
              >
                Capture & Trigger AI Triage →
              </button>
            </div>
          </form>
        </section>

        {/* AI Triage Live Prediction Box */}
        <section className="space-y-4">
          <div className="rounded-3xl border border-sky-200 bg-sky-50/70 p-6">
            <h3 className="text-sm font-bold text-sky-900">AI Intelligence Triage Preview</h3>
            <p className="mt-1 text-xs text-slate-600">
              Upon submission, Gemini will classify this item against university domain taxonomies and recommend sequential routing.
            </p>

            <div className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-white p-3 border border-sky-100 shadow-sm">
                <span className="font-bold text-slate-500">Automated Threshold:</span>
                <p className="font-bold text-slate-900 mt-0.5">≥ 95% Confidence (Configured)</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-sky-100 shadow-sm">
                <span className="font-bold text-slate-500">Institutional Precedence:</span>
                <p className="font-medium text-slate-700 mt-0.5">
                  Governance rules automatically override AI confidence for confidential Senate items.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
