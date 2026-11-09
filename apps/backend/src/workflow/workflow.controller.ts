import { Body, Controller, Post } from '@nestjs/common';
import { WorkflowService } from './workflow.service';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('advance')
  async advance(@Body() body: { currentStage: string; allowedStages: string[]; completed: boolean }) {
    return this.workflowService.progressWorkflow(body);
  }
}
