import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class IncomingItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getIncomingItems() {
    return this.prisma.incomingItem.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createIncomingItem(data: {
    source: string;
    subject: string;
    sender: string;
    body?: string | null;
    status: string;
  }) {
    return this.prisma.incomingItem.create({
      data,
    });
  }
}
