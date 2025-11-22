import { Get,Post,Put } from "@nestjs/common";
import { Controller, Body, Param, Query } from '@nestjs/common';
import { SellerOrdersService } from './seller-orders.servive';
import { UpdateOrderStatusDto } from '../update-order-status.dto';
@Controller('seller/orders')
export class SellerOrdersController {
  constructor(private readonly sellerOrdersService: SellerOrdersService) {}
    @Get()  
    getOrders(
      @Query('sellerId') sellerId: string,
      @Query('page') page?: string,
        @Query('take') take?: string,
        @Query('status') status?: string,
        @Query('sort') sort?: 'asc' | 'desc',
    ) {
      return this.sellerOrdersService.getSellerOrders(
        Number(sellerId),
        page ? Number(page) : undefined,
        take ? Number(take) : undefined,
        status,
        sort,
      );
    }
    @Get(':orderId')
    getOrderById(
      @Param('orderId') orderId: string,
        @Query('sellerId') sellerId: string,
    ) {
      return this.sellerOrdersService.getOrderByIdForSeller(
        Number(orderId),
        Number(sellerId),
      );
    }
    @Put(':orderId/status')
    updateOrderStatus(
      @Param('orderId') orderId: string,
        @Query('sellerId') sellerId: string,
        @Body() dto: UpdateOrderStatusDto,
    ) {
      return this.sellerOrdersService.updateOrderStatus(
        Number(orderId),
        Number(sellerId),
        dto,
      );
    }
    @Post(':orderId/cancel')
    cancelOrder(
      @Param('orderId') orderId: string,
        @Query('sellerId') sellerId: string,
    ) {
      return this.sellerOrdersService.cancelOrder(
        Number(orderId),
        Number(sellerId),
        );
    }
}