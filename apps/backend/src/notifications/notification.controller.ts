import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Post()
  async createNotification(@Body() body: { userId: string; type: string; title: string; message: string; read: boolean }) {
    return this.notificationService.createNotification(body);
  }
}
