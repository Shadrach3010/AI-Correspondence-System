import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  private readonly notifications = [
    {
      id: 'notif-1',
      userId: 'user-1',
      type: 'NEW_ASSIGNMENT',
      title: 'New correspondence assigned',
      message: 'You were assigned a procurement review item.',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'notif-2',
      userId: 'user-2',
      type: 'OVERDUE',
      title: 'SLA nearing breach',
      message: 'This item requires urgent attention before deadline.',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ];

  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
  }) {
    const item = {
      id: `notif-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(item);
    return item;
  }

  async getNotificationsForUser(userId: string) {
    return this.notifications.filter((n) => n.userId === userId);
  }
}
