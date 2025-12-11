import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private formatProduct(p: any) {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
      storeId: p.storeId,
      storeName: p.store?.name,
      createdAt: p.createdAt,
    };
  }

  async createProduct(dto: ProductDto) {
    if (!dto.storeId) throw new BadRequestException('Store ID is required');

    const store = await this.prisma.store.findUnique({
      where: { id: dto.storeId },
    });
    if (!store) throw new NotFoundException('Store not found');

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        imageUrl: dto.imageUrl,
        storeId: dto.storeId,
      },
      include: { store: true },
    });

    return this.formatProduct(product);
  }

  async getProducts() {
    const products = await this.prisma.product.findMany({
      include: { store: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(this.formatProduct);
  }

  async getAllProducts() {
    const products = await this.prisma.product.findMany({
      include: { store: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return products.map(this.formatProduct);
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { store: true },
    });

    if (!product) throw new NotFoundException('Product not found');

    return this.formatProduct(product);
  }

  async getProductsByStore(storeId: number) {
    const products = await this.prisma.product.findMany({
      where: { storeId },
      include: { store: true },
      orderBy: { createdAt: 'desc' },
    });

    return products.map(this.formatProduct);
  }

  async deleteProductWithCarts(productId: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.cart.deleteMany({ where: { productId } });
    await this.prisma.order.deleteMany({ where: { productId } });
    await this.prisma.reviews.deleteMany({ where: { productId } });

    await this.prisma.product.delete({ where: { id: productId } });

    return { message: 'Product and related data deleted successfully' };
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: { store: true },
    });

    return this.formatProduct(updated);
  }
}
