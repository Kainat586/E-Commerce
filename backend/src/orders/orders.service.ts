import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(
    userId: number,
    address?: string | null,
    selectedProductIds?: number[],
    customerPhone?: string,
  ) {
    const cartItems = await this.prisma.cart.findMany({
      where: {
        userId,
        ...(selectedProductIds ? { productId: { in: selectedProductIds } } : {}),
      },
      include: { product: true, user: true },
    });

    if (!cartItems.length) {
      throw new BadRequestException('No items selected for checkout!');
    }

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Only ${item.product.stock} items left in stock for "${item.product.name}".`,
        );
      }
    }

    const orders = await this.prisma.$transaction(async (prisma) => {
      const createdOrders = await Promise.all(
        cartItems.map((item) =>
          prisma.order.create({
            data: {
              userId,
              productId: item.productId,
              quantity: item.quantity,
              totalPrice: item.quantity * item.product.price,
              customerName: item.user.name ?? '',
              customerEmail: item.user.email ?? '',
              customerPhone: customerPhone ?? '',
              address: address ?? 'No address provided',
              status: 'PENDING',
            },
          }),
        ),
      );

      await Promise.all(
        cartItems.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      // 3. Clear cart
      await prisma.cart.deleteMany({
        where: {
          userId,
          ...(selectedProductIds ? { productId: { in: selectedProductIds } } : {}),
        },
      });

      return createdOrders;
    });

    return { message: 'Order placed successfully!', orders };
  }

  async getOrdersByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            imageUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { product: true, user: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    let step = 0;

    switch (order.status) {
      case OrderStatus.PENDING:
        step = 0;
        break;
      case OrderStatus.SHIPPED:
        step = 10;
        break;
      case OrderStatus.DELIVERED:
        step = 20;
        break;
    }

    return { ...order, step };
  }
}
