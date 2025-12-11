import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './create-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async createStore(userId: number, dto: CreateStoreDto) {
    const existing = await this.prisma.store.findUnique({
      where: { sellerId: userId },
    });
    if (existing) throw new BadRequestException('You already have a store');

    return this.prisma.store.create({
      data: {
        sellerId: userId,
        name: dto.name,
        description: dto.description,
        address: dto.address,
        logo: dto.logo,
      },
    });
  }
  
  async getMyStore(userId: number) {
    return this.prisma.store.findUnique({
      where: { sellerId: userId },
    });
  }

  async getAllStores() {
    return this.prisma.store.findMany();
  }

  async getNewArrivals(storeId: number) {
    return this.prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }

  async getTopSelling(storeId: number) {
    const topSelling = await this.prisma.order.groupBy({
      by: ['productId'],
      where: { product: { storeId } },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    const products = await Promise.all(
      topSelling.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });
        return {
          ...product,
          soldQuantity: item._sum?.quantity || 0,
        };
      })
    );

    return products;
  }
}
