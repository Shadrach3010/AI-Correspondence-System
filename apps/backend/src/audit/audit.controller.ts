import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(':targetId')
  async getAuditTrail(@Param('targetId') targetId: string) {
    return this.auditService.getAuditTrail(targetId);
  }

  @Post()
  async logEvent(
    @Body()
    body: {
      actorId: string;
      action: string;
      targetType: string;
      targetId: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.auditService.logEvent(body);
  }
}
