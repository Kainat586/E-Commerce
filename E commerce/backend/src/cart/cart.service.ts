import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  
  async addToCart(data: {
    userId?: number;
    guestId?: string;
    productId: number;
    quantity?: number;
  }) {
    const { userId, guestId, productId, quantity = 1 } = data;

    const whereClause = userId ? { userId, productId } : { guestId, productId };

    const existing = await this.prisma.cart.findFirst({ where: whereClause });

    if (existing) {
      return this.prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return this.prisma.cart.create({ data });
  }


  async getCart(id: string) {
    if (id.startsWith('guest-')) {
      return await this.prisma.cart.findMany({
        where: { guestId: id },
        include: { product: true },
      });
    } else {
      return await this.prisma.cart.findMany({
        where: { userId: Number(id) },
        include: { product: true },
      });
    }
  }
  async updateCartQuantity(data: { userId?: number; guestId?: string; productId: number; quantity: number }) {
    const { userId, guestId, productId, quantity } = data;
    const where = userId ? { userId, productId } : { guestId, productId };

    const existing = await this.prisma.cart.findFirst({ where });
    if (!existing) return { message: 'Item not found' };

    const newQty = Math.max(1, quantity);
    const updated = await this.prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
    return { message: 'Quantity updated', newQty: updated.quantity };
  }


  async removeFromCart(data: { userId?: number; guestId?: string; productId: number }) {
    const { userId, guestId, productId } = data;
    const whereClause = userId ? { userId, productId } : { guestId, productId };
    return this.prisma.cart.deleteMany({ where: whereClause });
  }

  async clearCart(id: string) {
    if (id.startsWith('guest-')) {
      return this.prisma.cart.deleteMany({ where: { guestId: id } });
    } else {
      return this.prisma.cart.deleteMany({ where: { userId: Number(id) } });
    }
  }

  async mergeGuestCartToUser(guestId: string, userId: number) {
    await this.prisma.cart.updateMany({
      where: { guestId },
      data: { guestId: null, userId },
    });
    return { message: 'Cart merged successfully' };
  }

  
}
