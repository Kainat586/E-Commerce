import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderStatusDto } from '../update-order-status.dto';

@Injectable()
export class SellerOrdersService {
  constructor(private prisma: PrismaService) {}

  async getSellerOrders(sellerId: number, page = 1, take = 20, status?: string) {
    const skip = (page - 1) * take;

    const where: any = {};
    if (status) where.status = status;

    const orders = await this.prisma.order.findMany({
      where: { AND: [where, { product: { store: { sellerId } } }] },
      include: {
        product: { select: { id: true, name: true, imageUrl: true, price: true, storeId: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const total = await this.prisma.order.count({
      where: { AND: [where, { product: { store: { sellerId } } }] },
    });

    return { data: orders, meta: { page, take, total } };
  }

  async getOrderByIdForSeller(orderId: number, sellerId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { product: { include: { store: true } }, user: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.product.store.sellerId !== sellerId)
      throw new ForbiddenException('Not authorized to view this order');

    return order;
  }

 async updateOrderStatus(orderId: number, sellerId: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { product: { include: { store: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.product.store.sellerId !== sellerId)
      throw new ForbiddenException('Not authorized to update this order');

    console.log('Updating order', orderId, 'from status', order.status, 'to', dto.status);

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: dto.status },
    });

    console.log('Updated order', updatedOrder.id, 'status is now', updatedOrder.status);
    return updatedOrder;
  }

}