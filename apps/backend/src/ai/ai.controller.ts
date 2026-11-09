import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  async analyze(@Body() body: { subject: string; body?: string | null; sender?: string | null }) {
    return this.aiService.analyze(body);
  }
}
