import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should create a notification payload for a new assignment', async () => {
    const result = await service.createNotification({
      userId: 'user-1',
      type: 'NEW_ASSIGNMENT',
      title: 'New correspondence assigned',
      message: 'A procurement item was assigned to you.',
      read: false,
    });

    expect(result).toMatchObject({
      userId: 'user-1',
      type: 'NEW_ASSIGNMENT',
      title: 'New correspondence assigned',
      message: 'A procurement item was assigned to you.',
      read: false,
    });
  });

  it('should return unread notifications for a user', async () => {
    const result = await service.getNotificationsForUser('user-1');

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userId: 'user-1', read: false }),
      ]),
    );
  });
});
