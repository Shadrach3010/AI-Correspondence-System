import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getOverview() {
    return {
      organization: 'University of Excellence',
      totalIncoming: 1248,
      pending: 179,
      unassigned: 23,
      overdue: 24,
      departments: [
        { name: 'Registry', count: 318 },
        { name: 'Finance', count: 214 },
        { name: 'Procurement', count: 176 },
        { name: 'Academic Affairs', count: 194 },
      ],
      slaCompliance: 94.2,
      automationRate: 81.5,
      recentActivity: [
        { action: 'Correspondence received', actor: 'Inbound Mailbox', time: '08:10' },
        { action: 'AI analysis completed', actor: 'Gemini AI', time: '08:13' },
        { action: 'Assigned to Finance', actor: 'Registry Officer', time: '08:24' },
      ],
    };
  }
}
