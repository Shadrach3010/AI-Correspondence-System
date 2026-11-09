import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { PrismaService } from '../database/prisma.service';

describe('DepartmentService', () => {
  let service: DepartmentService;

  const prismaMock = {
    department: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'dept-1', name: 'Registry', code: 'REG', active: true },
        { id: 'dept-2', name: 'Finance', code: 'FIN', active: true },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should return active departments from the database', async () => {
    const result = await service.getDepartments();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      name: 'Registry',
      code: 'REG',
      active: true,
    });
    expect(prismaMock.department.findMany).toHaveBeenCalledWith({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  });
});
