import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class SitereviewsService {
    constructor(private prisma: PrismaService) { }
    async createSiteReview(userId: number, rating: number, comment: string) {
        return this.prisma.siteReviews.create({
            data: {
                userId,
                rating,
                comment,
            },
        });
    }
    async getAllSiteReviews() {
        return this.prisma.siteReviews.findMany({
            include: {
                user: { select: { name: true } },
            },
        });
    }
}
