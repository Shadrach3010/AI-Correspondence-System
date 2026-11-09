import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getInstitutions() {
    return this.prisma.institution.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  }
}
