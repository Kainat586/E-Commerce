import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Prisma } from 'generated/prisma';

@Module({
  providers: [OrdersService,PrismaService],
  controllers: [OrdersController]
})
export class OrdersModule {}
