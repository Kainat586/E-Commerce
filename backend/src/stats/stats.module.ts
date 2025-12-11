import { Module } from '@nestjs/common';
import { SellerStatsService } from './stats.service';
import { SellerStatsController } from './stats.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [SellerStatsService,PrismaService]
  ,controllers: [SellerStatsController],
})
export class StatsModule {}
