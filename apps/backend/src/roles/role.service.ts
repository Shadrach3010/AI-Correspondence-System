import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles() {
    return this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async createRole(data: { name: string; description?: string; permissions?: Record<string, unknown> }) {
    return this.prisma.role.create({
      data: {
        ...data,
        permissions: data.permissions ?? {},
      },
    });
  }
}
