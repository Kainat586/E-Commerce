import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) { }
  async createReview(productId: number, userId: number, rating: number, comment: string) {
    return this.prisma.reviews.create({
      data: {
        productId,
        userId,
        rating,
        comment,
      },
    });
  }
  async getReviewsByProduct(productId: number) {
    return this.prisma.reviews.findMany({
      where: { productId },
    });
  }
  async gettopReviews() {
    return this.prisma.reviews.findMany({
      orderBy: { rating: 'desc' },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
    });


  }

}
