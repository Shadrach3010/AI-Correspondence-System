import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportService {
  getOverview() {
    return {
      totalIncoming: 1248,
      pending: 179,
      overdue: 24,
      slaCompliance: 94.2,
      automationRate: 81.5,
      departmentBreakdown: [
        { name: 'Registry', count: 318, sla: 96.1 },
        { name: 'Finance', count: 214, sla: 92.8 },
        { name: 'Procurement', count: 176, sla: 90.4 },
        { name: 'Academic Affairs', count: 194, sla: 93.7 },
      ],
      recentTrends: [
        { period: 'This month', total: 318, delta: 12.4 },
        { period: 'Last month', total: 282, delta: 8.1 },
      ],
    };
  }

  getDepartmentPerformance() {
    return [
      { name: 'Registry', cases: 318, sla: 96.1, avgResolutionDays: 3.8 },
      { name: 'Finance', cases: 214, sla: 92.8, avgResolutionDays: 4.2 },
      { name: 'Procurement', cases: 176, sla: 90.4, avgResolutionDays: 5.1 },
      { name: 'Academic Affairs', cases: 194, sla: 93.7, avgResolutionDays: 4.6 },
    ];
  }
}
