import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('overview')
  getOverview() {
    return this.reportService.getOverview();
  }

  @Get('department-performance')
  getDepartmentPerformance() {
    return this.reportService.getDepartmentPerformance();
  }
}
