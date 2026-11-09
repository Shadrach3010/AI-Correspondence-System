import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getAssignments() {
    return this.prisma.assignment.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAssignment(data: {
    correspondenceId: string;
    assigneeId: string;
    status: string;
    priority: string;
    notes?: string | null;
  }) {
    return this.prisma.assignment.create({
      data,
    });
  }
}
