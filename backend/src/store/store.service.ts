import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // adjust path
import { CreateStoreDto } from './create-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async createStore(userId: number, dto: CreateStoreDto) {
    // Check if seller already has a store
    const existing = await this.prisma.store.findUnique({
      where: { sellerId: userId },
    });

    if (existing) throw new BadRequestException('You already have a store');

    const store = await this.prisma.store.create({
      data: {
        sellerId: userId,
        name: dto.name,
        description: dto.description,
        address: dto.address,
        logo: dto.logo,
      },
    });

    return store;
  }

  async getMyStore(userId: number) {
    return this.prisma.store.findUnique({
      where: { sellerId: userId },
    });
  }
}
