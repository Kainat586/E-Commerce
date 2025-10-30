import { Module } from '@nestjs/common';
import { BrandsController } from './brand.controller';
import { BrandsService } from './brand.service'; 
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService,PrismaService], 
  exports: [BrandsService],   
})
export class BrandModule {}
