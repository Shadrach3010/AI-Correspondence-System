import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditService],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  it('should log an audit event with actor, action, and target', async () => {
    const result = await service.logEvent({
      actorId: 'user-1',
      action: 'ASSIGNMENT_CREATED',
      targetType: 'INCOMING_ITEM',
      targetId: 'item-101',
      metadata: { department: 'Finance' },
    });

    expect(result).toMatchObject({
      actorId: 'user-1',
      action: 'ASSIGNMENT_CREATED',
      targetType: 'INCOMING_ITEM',
      targetId: 'item-101',
      metadata: { department: 'Finance' },
    });
  });

  it('should return audit events for a target', async () => {
    const result = await service.getAuditTrail('item-101');

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ targetId: 'item-101' }),
      ]),
    );
  });
});
