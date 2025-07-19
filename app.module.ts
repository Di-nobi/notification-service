import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notifications/notification.modules';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    NotificationModule,
  ],
})
export class AppModule {}