import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Checkout: move all cart items to Orders
  async checkout(userId: number, address?: string) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (!cartItems.length) throw new Error('Cart is empty!');

    const orders = await Promise.all(
      cartItems.map((item) =>
        this.prisma.order.create({
          data: {
            userId,
            productId: item.productId,
            quantity: item.quantity,
            totalPrice: item.quantity * item.product.price,
            address: address || null,
          },
        })
      )
    );

    // ✅ Decrement product stock
    for (const item of cartItems) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // ✅ Clear cart after checkout
    await this.prisma.cart.deleteMany({ where: { userId } });

    return orders;
  }

  // ✅ Get all orders for a user
  async getOrdersByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { product: true },
    });
  }
}
