import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'icms-backend',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'pending',
        ai: 'configured',
        queue: 'configured',
      },
    };
  }
}
