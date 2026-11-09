import { Test, TestingModule } from '@nestjs/testing';
import { EmailIngestService } from './email-ingest.service';

describe('EmailIngestService', () => {
  let service: EmailIngestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailIngestService],
    }).compile();

    service = module.get<EmailIngestService>(EmailIngestService);
  });

  it('should convert an inbound email into a structured incoming item payload', async () => {
    const result = await service.ingest({
      from: 'finance@university.edu',
      subject: 'Procurement approval request',
      body: 'Please approve the research equipment payment.',
      attachments: [{ filename: 'invoice.pdf', mimeType: 'application/pdf', size: 120000 }],
    });

    expect(result).toMatchObject({
      source: 'EMAIL',
      sender: 'finance@university.edu',
      subject: 'Procurement approval request',
      body: 'Please approve the research equipment payment.',
      attachments: expect.arrayContaining([
        expect.objectContaining({ filename: 'invoice.pdf' }),
      ]),
    });
  });
});
