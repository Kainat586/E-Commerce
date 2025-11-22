import { Controller, Get, Post ,Body} from '@nestjs/common';
import { SitereviewsService } from './sitereviews.service';
@Controller('sitereviews')
export class SitereviewsController {
    constructor(private readonly sitereviewsService: SitereviewsService) { }
    @Post()
    async createSiteReview(
        @Body()
        body: { userId: number; rating: number; comment: string },
    ) {
        return this.sitereviewsService.createSiteReview(
            body.userId,
            body.rating,
            body.comment,
        );
    }

    @Get()
    async getAllSiteReviews() {
        return this.sitereviewsService.getAllSiteReviews();
    }
}
