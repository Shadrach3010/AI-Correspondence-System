import { Body, Controller, Get, Post } from '@nestjs/common';
import { IncomingItemService } from './incoming-item.service';

@Controller('incoming-items')
export class IncomingItemController {
  constructor(private readonly incomingItemService: IncomingItemService) {}

  @Get()
  async getIncomingItems() {
    return this.incomingItemService.getIncomingItems();
  }

  @Post()
  async createIncomingItem(
    @Body()
    body: {
      source: string;
      subject: string;
      sender: string;
      body?: string | null;
      status: string;
    },
  ) {
    return this.incomingItemService.createIncomingItem(body);
  }
}
