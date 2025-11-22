import { Controller, Get, Post, Body, Delete, Param, Put, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';
import { UpdateProductDto } from './update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: ProductDto) {
    try {
      return await this.productsService.createProduct(createProductDto);
    } catch (err) {
      console.error('Error in createProduct:', err);
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  @Get()
  async getProducts() {
    try {
      return await this.productsService.getProducts();
    } catch (err) {
      console.error('Error in getProducts:', err);
      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    try {
      return await this.productsService.getProductById(Number(id));
    } catch (err) {
      console.error('Error in getProductById:', err);
      throw new InternalServerErrorException('Failed to fetch product');
    }
  }

  @Get('store/:storeId')
  async getProductsByStore(@Param('storeId') storeId: string) {
    return await this.productsService.getProductsByStore(Number(storeId));
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productsService.updateProduct(Number(id), updateProductDto);
    } catch (err) {
      console.error('Error in updateProduct:', err);
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      return await this.productsService.deleteProductWithCarts(Number(id));
    } catch (err) {
      console.error('Error in deleteProduct:', err);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }
}
