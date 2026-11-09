import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly auditTrail = [
    {
      id: 'audit-1',
      actorId: 'system',
      action: 'INCOMING_ITEM_RECEIVED',
      targetType: 'INCOMING_ITEM',
      targetId: 'item-101',
      metadata: { source: 'EMAIL' },
      createdAt: new Date().toISOString(),
    },
  ];

  async logEvent(data: {
    actorId: string;
    action: string;
    targetType: string;
    targetId: string;
    metadata?: Record<string, unknown>;
  }) {
    const event = {
      id: `audit-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.auditTrail.unshift(event);
    return event;
  }

  async getAuditTrail(targetId: string) {
    return this.auditTrail.filter((event) => event.targetId === targetId);
  }
}
