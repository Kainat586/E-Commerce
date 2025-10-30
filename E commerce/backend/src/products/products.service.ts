import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  brandId: number;
}) {
  if (!data.brandId) {
    throw new Error('Brand ID is required');
  }

  const brand = await this.prisma.brand.findUnique({
    where: { id: data.brandId },
  });

  if (!brand) {
    throw new Error(`Brand with ID ${data.brandId} not found`);
  }

  return await this.prisma.product.create({
    data: {
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      brand: { connect: { id: data.brandId } },
    },
  });
}


  

  async getproducts() {
  try {
    const products = await this.prisma.product.findMany({
      include: { brand: true },
    });

    return Array.isArray(products)
      ? products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          imageUrl: p.imageUrl,
          brand: p.brand?.name || "Unknown",
          createdAt: p.createdAt,
        }))
      : [];
  } catch (err) {
    console.error("❌ Error in getproducts:", err);
    throw new Error("Failed to fetch products");
  }
}
async getProductById(id: number) {
  return await this.prisma.product.findUnique({
    where: { id }, // ✅ pass the variable value
    include: { brand: true },
  });
}


async getProductsByBrand(brandName: string) {
  return await this.prisma.product.findMany({
    where: {
      brand: {
        name: brandName, // match Brand.name
      },
    },
    include: {
      brand: true, // optional, if you want brand info in results
    },
  });
}


  async getNewArrivalsByBrand(brandName: string) {
    return await this.prisma.product.findMany({
      where: { brand: { name: brandName } },
      orderBy: { createdAt: 'desc' },
      include: { brand: true },
      take: 8,
    });
  }

  async getTopSellingByBrand(brandName: string) {
    return await this.prisma.product.findMany({
      where: { brand: { name: brandName } },
      orderBy: { stock: 'asc' },
      include: { brand: true },
      take: 8,
    });
  }

  async deleteproduct(id: number) {
    await this.prisma.reviews.deleteMany({ where: { productId: id } });
    await this.prisma.order.deleteMany({ where: { productId: id } });
    return await this.prisma.product.delete({ where: { id } });
  }

  async updateProduct(
    id: number,
    data: { name?: string; description?: string; price?: number; stock?: number; imageUrl?: string },
  ) {
    const existingProduct = await this.prisma.product.findUnique({ where: { id } });
    if (!existingProduct) throw new NotFoundException(`Product with ID ${id} not found`);
    return await this.prisma.product.update({ where: { id }, data });
  }
}
