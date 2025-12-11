import { Controller, Get, Put, Param, Query, Body, UseGuards,UsePipes,ValidationPipe } from '@nestjs/common';
import { SellerOrdersService } from './seller-orders.service';
import { UpdateOrderStatusDto } from '../update-order-status.dto';

@Controller('seller/orders')
export class SellerOrdersController {
  constructor(private readonly service: SellerOrdersService) {}

  @Get()
  async getOrders(
    @Query('sellerId') sellerId: string,
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.service.getSellerOrders(Number(sellerId), Number(page) || 1, 20, status);
  }

  @Get(':id')
  async getOrder(
    @Param('id') orderId: string,
    @Query('sellerId') sellerId: string,
  ) {
    return this.service.getOrderByIdForSeller(Number(orderId), Number(sellerId));
  }

 @Put(':id/status')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateStatus(
    @Param('id') orderId: string,
    @Query('sellerId') sellerId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.service.updateOrderStatus(Number(orderId), Number(sellerId), dto);
  }
}
