import { Body, Controller, Post } from '@nestjs/common';
import { EmailIngestService } from './email-ingest.service';

@Controller('email')
export class EmailIngestController {
  constructor(private readonly emailIngestService: EmailIngestService) {}

  @Post('ingest')
  async ingest(@Body() body: { from: string; subject: string; body?: string | null; attachments?: Array<{ filename: string; mimeType: string; size: number }> }) {
    return this.emailIngestService.ingest(body);
  }
}
