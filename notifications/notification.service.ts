// src/notifications/notifications.service.ts
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class NotificationService  {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  async createNotification(type: string, message: string) {
    const notification = {
      id: Date.now().toString(),
      type,
      message,
      createdAt: new Date(),
    };
    await this.redis.set(`notification:${notification.id}`, JSON.stringify(notification));
    console.log('Notification:', notification.message);
  }

  async getNotification(notificationId: string): Promise<any> {
    const notification = await this.redis.get(`notification:${notificationId}`);
    if (!notification) throw new BadRequestException('Notification not found');
    return JSON.parse(notification);
  }
}