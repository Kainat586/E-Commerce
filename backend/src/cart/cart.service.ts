import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartDto } from './create-cart.dto';
import { UpdateCartDto } from './update-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(createCartDto: CreateCartDto): Promise<any> {
  try {
    const { userId, productId, quantity = 1 } = createCartDto;

    if (userId === undefined || productId === undefined) {
      throw new Error('User ID and Product ID are required');
    }

    const existing = await this.prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (existing) {
      return this.prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    const cart = await this.prisma.cart.create({
      data: {
        userId: userId, 
        productId: productId,
        quantity: quantity,
      },
    });

    return { message: 'Cart created successfully', cart };
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

 async getuserCart(userId: number):Promise<any> {
    try {
      return await this.prisma.cart.findMany({
        where: { userId },
        include: { product: true },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch cart');
    }
  }
  async updateCartQuantity(userId: number, productId: number, quantity: number) {
  try {
    const existing = await this.prisma.cart.findFirst({
      where: { userId, productId },
    });

    if (!existing) {
      throw new NotFoundException('Item not found in cart');
    }

    const newQty = Math.max(1, quantity); 

    const updated = await this.prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: newQty },
      include: { product: true },
    });

    return { message: 'Quantity updated successfully', updated };
  } catch (error) {
    throw new InternalServerErrorException(error.message || 'Failed to update quantity');
  }
}

  async removeFromCart(userId: number, productId: number) {
    try {
      await this.prisma.cart.deleteMany({ where: { userId, productId } });
      return { message: 'Item removed from cart' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to remove item');
    }
  }


  async clearCart(userId: number) {
    try {
      await this.prisma.cart.deleteMany({ where: { userId } });
      return { message: 'Cart cleared successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to clear cart');
    }
  }
}
