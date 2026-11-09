import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkflowService {
  async progressWorkflow(data: {
    currentStage: string;
    allowedStages: string[];
    completed: boolean;
  }) {
    const index = data.allowedStages.indexOf(data.currentStage);

    if (!data.completed) {
      return {
        currentStage: data.currentStage,
        status: 'AWAITING_ACTION',
        canAdvance: false,
      };
    }

    const nextStage = data.allowedStages[index + 1] ?? 'ARCHIVED';

    return {
      currentStage: nextStage,
      status: nextStage === 'ARCHIVED' ? 'COMPLETED' : 'IN_PROGRESS',
      canAdvance: nextStage !== 'ARCHIVED',
    };
  }
}
