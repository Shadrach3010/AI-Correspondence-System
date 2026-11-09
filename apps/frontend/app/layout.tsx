import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '../components/app-shell';
import { ICMSProvider } from '../store/icms-store';
import { AssignmentPreviewModal } from '../components/assignment-preview-modal';
import { IncomingItemPreviewModal } from '../components/incoming-item-preview-modal';

export const metadata: Metadata = {
  title: 'ICMS | University Correspondence Management',
  description: 'Intelligent Correspondence Management System for higher education operations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-transparent text-slate-900 antialiased">
        <ICMSProvider>
          <AppShell>{children}</AppShell>
          <AssignmentPreviewModal />
          <IncomingItemPreviewModal />
        </ICMSProvider>
      </body>
    </html>
  );
}
