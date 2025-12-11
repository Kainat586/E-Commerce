import { Controller, Get, Param } from '@nestjs/common';
import { SellerStatsService } from './stats.service';

@Controller('seller/stats')
export class SellerStatsController {
  constructor(private readonly statsService: SellerStatsService) {}

  @Get(':sellerId')
  async getStats(@Param('sellerId') sellerId: string) {
    return this.statsService.getStats(Number(sellerId));
  }

  @Get('orders/graph/:sellerId')
  async getOrdersGraph(@Param('sellerId') sellerId: string) {
    return this.statsService.getOrdersGraph(Number(sellerId));
  }

  @Get('revenue/graph/:sellerId')
  async getRevenueGraph(@Param('sellerId') sellerId: string) {
    return this.statsService.getRevenueGraph(Number(sellerId));
  }
}
