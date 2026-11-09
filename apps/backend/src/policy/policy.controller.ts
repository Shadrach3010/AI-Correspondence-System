import { Body, Controller, Post } from '@nestjs/common';
import { PolicyService } from './policy.service';

@Controller('policy')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post('evaluate')
  async evaluate(
    @Body()
    body: {
      classification: string;
      department: string;
      confidence: number;
      policyFlags?: string[];
    },
  ) {
    return this.policyService.evaluate(body);
  }
}
