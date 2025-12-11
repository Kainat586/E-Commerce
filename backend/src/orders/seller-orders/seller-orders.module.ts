import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { SellerOrdersController } from './seller-orders.controller';
import { SellerOrdersService } from './seller-orders.service';


@Module({
  providers: [SellerOrdersService,PrismaService],
  controllers: [SellerOrdersController]
})
export class SellerOrdersModule {}
