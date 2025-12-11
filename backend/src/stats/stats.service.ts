import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SellerStatsDto } from './seller-stats.dto';

@Injectable()
export class SellerStatsService {
  constructor(private prisma: PrismaService) {}

  async getStats(sellerId: number): Promise<SellerStatsDto> {
    const store = await this.prisma.store.findFirst({ where: { sellerId } });

    if (!store) {
      throw new NotFoundException('Store not found for this seller');
    }

    const totalProducts = await this.prisma.product.count({ where: { storeId: store.id } });

    const totalOrders = await this.prisma.order.count({
      where: { product: { storeId: store.id } },
    });

    const pendingOrders = await this.prisma.order.count({
      where: { product: { storeId: store.id }, status: 'PENDING' },
    });

    const revenueAgg = await this.prisma.order.aggregate({
      where: { product: { storeId: store.id } },
      _sum: { totalPrice: true },
    });

    const totalRevenue = revenueAgg._sum.totalPrice ?? 0;

    return { totalProducts, totalOrders, pendingOrders, totalRevenue };
  }

  async getOrdersGraph(sellerId: number) {
    const store = await this.prisma.store.findFirst({ where: { sellerId } });
    if (!store) throw new NotFoundException('Store not found for this seller');

    const orders = await this.prisma.order.findMany({
      where: { product: { storeId: store.id } },
      select: { createdAt: true },
    });

    const labels = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'short' }),
    );
    const data = Array(12).fill(0);

    orders.forEach(order => {
      const month = order.createdAt.getMonth();
      data[month]++;
    });

    return { labels, data };
  }

  // --- Revenue per month for chart ---
   async getRevenueGraph(sellerId: number) {
    const store = await this.prisma.store.findFirst({ where: { sellerId } });
    if (!store) throw new NotFoundException('Store not found for this seller');

    const orders = await this.prisma.order.findMany({
      where: {
        product: { storeId: store.id },
        status: 'DELIVERED',
      },
      select: { createdAt: true, totalPrice: true },
    });

    const labels = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'short' }),
    );
    const data = Array(12).fill(0);

    orders.forEach(order => {
      const month = order.createdAt.getMonth();
      data[month] += Number(order.totalPrice);
    });

    return { labels, data };
  }
}
