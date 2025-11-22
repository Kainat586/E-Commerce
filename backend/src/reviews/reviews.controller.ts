import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @Body() body: { productId: number; userId: number; rating: number; comment: string },
  ) {
    return this.reviewsService.createReview(
      body.productId,
      body.userId,
      body.rating,
      body.comment,
    );
  }

  @Get('product/:productId')
  async getReviewsByProduct(@Param('productId') productId: number) {
    return this.reviewsService.getReviewsByProduct(Number(productId));
  }

  @Get()
  async getTopReviews() {
    return this.reviewsService.gettopReviews();
  }
}
