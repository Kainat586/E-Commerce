import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body()
    body: {
      name: string;
      description?: string;
      price: number;
      stock: number;
      imageUrl?: string;
      brandId: number;
    },
  ) {
    return this.productsService.createProduct(body);
  }

  @Get()
  async getProducts() {
    return this.productsService.getproducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Get('brand/:brandName')
  async getProductsByBrand(@Param('brandName') brandName: string) {
    return this.productsService.getProductsByBrand(brandName);
  }

  @Get('brand/:brandName/new-arrivals')
  async getNewArrivals(@Param('brandName') brandName: string) {
    return this.productsService.getNewArrivalsByBrand(brandName);
  }

  @Get('brand/:brandName/top-selling')
  async getTopSelling(@Param('brandName') brandName: string) {
    return this.productsService.getTopSellingByBrand(brandName);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      imageUrl?: string;
      brandId?: number;
    },
  ) {
    return this.productsService.updateProduct(Number(id), body);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteproduct(Number(id));
  }
}
