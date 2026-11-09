import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async getDepartments() {
    return this.prisma.department.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }
}
