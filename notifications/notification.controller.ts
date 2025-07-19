// src/notification/notification.controller.ts
import { Controller, Get, Param, UseGuards, HttpCode } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guard/apiKey.guard';

@Controller('notifications')
@ApiTags('notifications')
@ApiSecurity('Api-Key')
@UseGuards(ApiKeyGuard)
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by ID' })
  @HttpCode(200)
  async getNotification(@Param('id') id: string) {
    const notification = await this.notificationsService.getNotification(id);
    return { success: true, message: 'Notification retrieved', data: notification };
  }

  //Listens to event
  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: any) {
    await this.notificationsService.createNotification(
      'order.created',
      `Order ${data.id} created for user ${data.userId}`,
    );
  }

  @EventPattern('payment.confirmed')
  async handlePaymentConfirmed(@Payload() data: any) {
    await this.notificationsService.createNotification(
      'payment.confirmed',
      `Payment ${data.id} confirmed for order ${data.orderId}`,
    );
  }
}
