import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OrdersService,PrismaService],
  controllers: [OrdersController]
})
export class OrdersModule {}
