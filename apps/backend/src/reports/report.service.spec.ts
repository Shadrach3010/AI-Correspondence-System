import { ReportService } from './report.service';

describe('ReportService', () => {
  it('builds an operational summary for leadership reporting', () => {
    const service = new ReportService();

    const overview = service.getOverview();

    expect(overview.totalIncoming).toBeGreaterThan(0);
    expect(overview.slaCompliance).toBeGreaterThan(0);
    expect(Array.isArray(overview.departmentBreakdown)).toBe(true);
    expect(overview.departmentBreakdown.length).toBeGreaterThan(0);
  });

  it('returns department performance metrics', () => {
    const service = new ReportService();

    const metrics = service.getDepartmentPerformance();

    expect(Array.isArray(metrics)).toBe(true);
    expect(metrics[0]).toHaveProperty('name');
    expect(metrics[0]).toHaveProperty('sla');
  });
});
