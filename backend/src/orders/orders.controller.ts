import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  checkout(@Body() body: { userId: number; address?: string }) {
    return this.ordersService.checkout(body.userId, body.address);
  }

  @Get(':userId')
  getOrders(@Param('userId') userId: string) {
    return this.ordersService.getOrdersByUser(Number(userId));
  }
}
