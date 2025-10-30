import { Controller, Get, Post, Body, Param, Delete, Req,Put } from '@nestjs/common';
import { BrandsService } from './brand.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  async createBrand(@Body() body: { name: string; logoUrl?: string; sellerId: number }) {
    return this.brandsService.createBrand(body);
  }

  @Get()
  async getAllBrands() {
    return this.brandsService.getAllBrands();
  }

  @Get('seller/:sellerId')
  async getBrandsBySeller(@Param('sellerId') sellerId: string) {
    return this.brandsService.getBrandsBySeller(Number(sellerId));
  }

  @Delete(':id/:sellerId')
  async deleteBrand(@Param('id') id: string, @Param('sellerId') sellerId: string) {
    return this.brandsService.deleteBrand(Number(id), Number(sellerId));
  }

  @Put('update/:id')
  async updateBrand(
    @Param('id') id: string,
    @Body() data: { name?: string; logoUrl?: string },
  ) {
    return this.brandsService.updateBrand(Number(id),  data);
  }
}
