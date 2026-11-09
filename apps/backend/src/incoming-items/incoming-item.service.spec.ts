import { Test, TestingModule } from '@nestjs/testing';
import { IncomingItemService } from './incoming-item.service';
import { PrismaService } from '../database/prisma.service';

describe('IncomingItemService', () => {
  let service: IncomingItemService;

  const prismaMock = {
    incomingItem: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'item-1',
          source: 'EMAIL',
          subject: 'Budget approval request',
          sender: 'finance@university.edu',
          status: 'RECEIVED',
        },
      ]),
      create: jest.fn().mockImplementation(async ({ data }) => ({
        id: 'item-2',
        ...data,
      })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomingItemService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<IncomingItemService>(IncomingItemService);
  });

  it('should list received incoming items', async () => {
    const result = await service.getIncomingItems();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      source: 'EMAIL',
      subject: 'Budget approval request',
      sender: 'finance@university.edu',
    });
    expect(prismaMock.incomingItem.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should create a new incoming item for email intake', async () => {
    const result = await service.createIncomingItem({
      source: 'EMAIL',
      subject: 'Student complaint',
      sender: 'student@university.edu',
      body: 'Request for academic record review.',
      status: 'RECEIVED',
    });

    expect(result).toMatchObject({
      source: 'EMAIL',
      subject: 'Student complaint',
      sender: 'student@university.edu',
      body: 'Request for academic record review.',
      status: 'RECEIVED',
    });
    expect(prismaMock.incomingItem.create).toHaveBeenCalledWith({
      data: {
        source: 'EMAIL',
        subject: 'Student complaint',
        sender: 'student@university.edu',
        body: 'Request for academic record review.',
        status: 'RECEIVED',
      },
    });
  });
});
