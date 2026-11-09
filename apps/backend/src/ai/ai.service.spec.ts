import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should classify incoming content and return a structured AI recommendation', async () => {
    const result = await service.analyze({
      subject: 'Procurement approval for lab equipment',
      body: 'Please approve the purchase of research equipment for the lab.',
      sender: 'admin@university.edu',
    });

    expect(result).toMatchObject({
      classification: 'PROCUREMENT',
      department: 'Finance',
      priority: 'HIGH',
      confidence: expect.any(Number),
      summary: expect.any(String),
      suggestedAction: expect.any(String),
      policyFlags: expect.any(Array),
    });
    expect(result.confidence).toBeGreaterThanOrEqual(0.95);
  });
});
