import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationService } from './organization.service';
import { PrismaService } from '../database/prisma.service';

describe('OrganizationService', () => {
  let service: OrganizationService;

  const prismaMock = {
    institution: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'inst-1', name: 'University of Excellence', code: 'UOE', active: true },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
  });

  it('should return active institutions from the database', async () => {
    const result = await service.getInstitutions();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      name: 'University of Excellence',
      code: 'UOE',
      active: true,
    });
    expect(prismaMock.institution.findMany).toHaveBeenCalledWith({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  });
});
