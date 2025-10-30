import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async createBrand(data: { name: string; logoUrl?: string; sellerId: number }) {
    const seller = await this.prisma.user.findUnique({ where: { id: data.sellerId } });
    if (!seller || seller.role !== 'SELLER') {
      throw new ForbiddenException('Only sellers can create brands');
    }

    return this.prisma.brand.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
        sellerId: data.sellerId,
      },
    });
  }

  async getAllBrands() {
    return this.prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        logoUrl: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBrandsBySeller(sellerId: number) {
    return this.prisma.brand.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }
  async updateBrand(id: number, updateData: { name?: string; logoUrl?: string }) {
  const brand = await this.prisma.brand.findUnique({ where: { id } });
  if (!brand) throw new NotFoundException('Brand not found');

  return await this.prisma.brand.update({
    where: { id },
    data: updateData,
  });
}

  async deleteBrand(id: number, sellerId: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    if (brand.sellerId !== sellerId) throw new ForbiddenException('Not authorized');

    await this.prisma.product.deleteMany({ where: { brandId: id } });
    return this.prisma.brand.delete({ where: { id } });
  }
}
