import { Controller, Get, Post, Body, Delete, Param, Put, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';
import { UpdateProductDto } from './update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() dto: ProductDto) {
    return await this.productsService.createProduct(dto);
  }

  @Get()
  async getProducts() {
    return await this.productsService.getProducts();
  }

  @Get('all')
  async getAllProducts() {
    return await this.productsService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productsService.getProductById(Number(id));
  }

  @Get('store/:storeId')
  async getProductsByStore(@Param('storeId') storeId: string) {
    return await this.productsService.getProductsByStore(Number(storeId));
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.productsService.updateProduct(Number(id), dto);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productsService.deleteProductWithCarts(Number(id));
  }
}
