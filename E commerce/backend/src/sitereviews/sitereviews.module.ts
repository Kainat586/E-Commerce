import { Module } from '@nestjs/common';
import { SitereviewsController } from './sitereviews.controller';
import { SitereviewsService } from './sitereviews.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SitereviewsController],
  providers: [SitereviewsService,PrismaService]
})
export class SitereviewsModule {}
