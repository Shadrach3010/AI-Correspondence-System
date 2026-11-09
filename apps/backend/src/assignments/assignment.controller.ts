import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssignmentService } from './assignment.service';

@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Get()
  async getAssignments() {
    return this.assignmentService.getAssignments();
  }

  @Post()
  async createAssignment(
    @Body()
    body: {
      correspondenceId: string;
      assigneeId: string;
      status: string;
      priority: string;
      notes?: string | null;
    },
  ) {
    return this.assignmentService.createAssignment(body);
  }
}
