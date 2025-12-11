import { Controller, Post, Body, Req, Get, Param, UseGuards, NotFoundException, HttpException, UnauthorizedException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthGuard)
  @Post('checkout')
  async checkout(
    @Req() req,
    @Body() body: { address?: string; selectedProductIds?: number[],customerPhone: string }
  ) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('User not authenticated');

    const userId = user.id;
    const address = body.address ?? null;
    const selectedProductIds = body.selectedProductIds ?? [];
    const customerPhone = body.customerPhone;
    if (!selectedProductIds.length) {
      throw new HttpException('No products selected for checkout', 400);
    }

return this.ordersService.checkout(
  userId,
  address,
  selectedProductIds,
  customerPhone
);
  }
  @UseGuards(AuthGuard)
  @Get("my")
  async getMyOrders(@Req() req) {
    const userId = req.user.id;  
    return this.ordersService.getOrdersByUser(userId);
  }
  @UseGuards(AuthGuard)
  @Get('track/:orderId')
  async trackOrder(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderById(Number(orderId));
  }
}
