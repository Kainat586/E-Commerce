import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Create a new product
  async createProduct(createProductDto: ProductDto): Promise<any> {
    try {
      if (!createProductDto.storeId) throw new BadRequestException('Store ID is required');

      const store = await this.prisma.store.findUnique({ where: { id: createProductDto.storeId } });
      if (!store) throw new NotFoundException(`Store with ID ${createProductDto.storeId} not found`);

      const imageUrl = createProductDto.imageUrl;
      if (imageUrl && !this.isValidUrl(imageUrl)) {
        console.warn(`Invalid URL format for imageUrl: ${imageUrl}`);
      }

      const product = await this.prisma.product.create({
        data: {
          name: createProductDto.name,
          description: createProductDto.description,
          price: createProductDto.price,
          stock: createProductDto.stock,
          imageUrl: imageUrl || null,
          storeId: createProductDto.storeId,
        },
        include: { store: true },
      });

      return { message: 'Product created successfully', product };
    } catch (error) {
      console.error('Error creating product:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Get all products
  async getProducts(): Promise<any[]> {
    try {
      const products = await this.prisma.product.findMany({ include: { store: true } });
      return products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        stock: p.stock,
        imageUrl: p.imageUrl,
        storeName: p.store.name,
        createdAt: p.createdAt,
      }));
    } catch (err) {
      console.error('Error fetching products:', err);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  // Get product by ID
  async getProductById(id: number): Promise<any> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { store: true },
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  // Get products by store
  async getProductsByStore(storeId: number): Promise<any[]> {
    return await this.prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      include: { store: true },
    });
  }

  // Delete product along with carts, orders, reviews
  async deleteProductWithCarts(productId: number): Promise<any> {
    try {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });
      if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);

      await this.prisma.cart.deleteMany({ where: { productId } });
      await this.prisma.order.deleteMany({ where: { productId } });
      await this.prisma.reviews.deleteMany({ where: { productId } });
      await this.prisma.product.delete({ where: { id: productId } });

      return { message: 'Product and all related carts, orders, and reviews deleted successfully' };
    } catch (err) {
      console.error('Error deleting product with carts:', err);
      throw new InternalServerErrorException('Failed to delete product and related data');
    }
  }

  // Update product
  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<any> {
    try {
      const product = await this.prisma.product.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');

      const updated = await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });

      return { message: 'Product updated successfully', updated };
    } catch (error) {
      console.error('Error updating product:', error);
      throw new InternalServerErrorException('Failed to update product');
    }
  }
}
