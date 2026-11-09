import { Test, TestingModule } from '@nestjs/testing';
import { PolicyService } from './policy.service';

describe('PolicyService', () => {
  let service: PolicyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolicyService],
    }).compile();

    service = module.get<PolicyService>(PolicyService);
  });

  it('should override AI when a confidential governance rule is present', async () => {
    const result = await service.evaluate({
      classification: 'GOVERNANCE',
      department: 'Vice Chancellor',
      confidence: 0.99,
      policyFlags: ['CONFIDENTIAL_REVIEW_REQUIRED'],
    });

    expect(result).toMatchObject({
      approved: false,
      route: 'Vice Chancellor',
      reason: expect.stringContaining('Confidential review required'),
      requiresHumanReview: true,
    });
  });

  it('should allow automatic routing when confidence is high and no policy blocks it', async () => {
    const result = await service.evaluate({
      classification: 'PROCUREMENT',
      department: 'Finance',
      confidence: 0.98,
      policyFlags: [],
    });

    expect(result).toMatchObject({
      approved: true,
      route: 'Finance',
      requiresHumanReview: false,
    });
  });
});
