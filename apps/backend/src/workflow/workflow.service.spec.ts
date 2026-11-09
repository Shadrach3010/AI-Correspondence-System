import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowService } from './workflow.service';

describe('WorkflowService', () => {
  let service: WorkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkflowService],
    }).compile();

    service = module.get<WorkflowService>(WorkflowService);
  });

  it('should advance a case through the expected sequence', async () => {
    const result = await service.progressWorkflow({
      currentStage: 'REGISTRY_REVIEW',
      allowedStages: ['REGISTRY_REVIEW', 'FINANCE_REVIEW', 'VICE_CHANCELLOR_APPROVAL', 'ARCHIVED'],
      completed: true,
    });

    expect(result).toMatchObject({
      currentStage: 'FINANCE_REVIEW',
      status: 'IN_PROGRESS',
      canAdvance: true,
    });
  });

  it('should block progression when the current stage is incomplete', async () => {
    const result = await service.progressWorkflow({
      currentStage: 'FINANCE_REVIEW',
      allowedStages: ['REGISTRY_REVIEW', 'FINANCE_REVIEW', 'VICE_CHANCELLOR_APPROVAL', 'ARCHIVED'],
      completed: false,
    });

    expect(result).toMatchObject({
      currentStage: 'FINANCE_REVIEW',
      status: 'AWAITING_ACTION',
      canAdvance: false,
    });
  });
});
