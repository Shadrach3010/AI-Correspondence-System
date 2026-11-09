import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentService } from './assignment.service';
import { PrismaService } from '../database/prisma.service';

describe('AssignmentService', () => {
  let service: AssignmentService;

  const prismaMock = {
    assignment: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'assignment-1',
          status: 'PENDING',
          assigneeId: 'user-1',
          priority: 'HIGH',
        },
      ]),
      create: jest.fn().mockImplementation(async ({ data }) => ({
        id: 'assignment-2',
        ...data,
      })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignmentService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<AssignmentService>(AssignmentService);
  });

  it('should list active assignments', async () => {
    const result = await service.getAssignments();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      status: 'PENDING',
      assigneeId: 'user-1',
      priority: 'HIGH',
    });
    expect(prismaMock.assignment.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should create an assignment for an incoming item', async () => {
    const result = await service.createAssignment({
      correspondenceId: 'c-123',
      assigneeId: 'user-2',
      status: 'PENDING',
      priority: 'HIGH',
      notes: 'Awaiting review by Registrar',
    });

    expect(result).toMatchObject({
      correspondenceId: 'c-123',
      assigneeId: 'user-2',
      status: 'PENDING',
      priority: 'HIGH',
      notes: 'Awaiting review by Registrar',
    });
    expect(prismaMock.assignment.create).toHaveBeenCalledWith({
      data: {
        correspondenceId: 'c-123',
        assigneeId: 'user-2',
        status: 'PENDING',
        priority: 'HIGH',
        notes: 'Awaiting review by Registrar',
      },
    });
  });
});
