import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailIngestService {
  async ingest(data: {
    from: string;
    subject: string;
    body?: string | null;
    attachments?: Array<{ filename: string; mimeType: string; size: number }>;
  }) {
    return {
      source: 'EMAIL',
      sender: data.from,
      subject: data.subject,
      body: data.body ?? '',
      attachments: (data.attachments ?? []).map((attachment) => ({
        ...attachment,
        source: 'EMAIL',
        uploadedAt: new Date().toISOString(),
      })),
    };
  }
}
