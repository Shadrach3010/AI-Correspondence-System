import { Module } from '@nestjs/common';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssignmentController } from './assignments/assignment.controller';
import { AssignmentService } from './assignments/assignment.service';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { DepartmentController } from './departments/department.controller';
import { DepartmentService } from './departments/department.service';
import { EmailIngestController } from './email/email-ingest.controller';
import { EmailIngestService } from './email/email-ingest.service';
import { PrismaService } from './database/prisma.service';
import { HealthController } from './health/health.controller';
import { IncomingItemController } from './incoming-items/incoming-item.controller';
import { IncomingItemService } from './incoming-items/incoming-item.service';
import { NotificationController } from './notifications/notification.controller';
import { NotificationService } from './notifications/notification.service';
import { OrganizationController } from './organizations/organization.controller';
import { OrganizationService } from './organizations/organization.service';
import { PolicyController } from './policy/policy.controller';
import { PolicyService } from './policy/policy.service';
import { ReportController } from './reports/report.controller';
import { ReportService } from './reports/report.service';
import { RoleController } from './roles/role.controller';
import { RoleService } from './roles/role.service';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { WorkflowController } from './workflow/workflow.controller';
import { WorkflowService } from './workflow/workflow.service';

@Module({
  imports: [],
  controllers: [AiController, AppController, AssignmentController, AuditController, AuthController, DashboardController, DepartmentController, EmailIngestController, HealthController, IncomingItemController, NotificationController, OrganizationController, PolicyController, ReportController, RoleController, UserController, WorkflowController],
  providers: [AiService, AppService, AssignmentService, AuditService, AuthService, DashboardService, DepartmentService, EmailIngestService, IncomingItemService, NotificationService, OrganizationService, PolicyService, PrismaService, ReportService, RoleService, UserService, WorkflowService],
})
export class AppModule {}
