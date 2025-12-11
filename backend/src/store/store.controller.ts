import { Controller, Post, Get, Body, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './create-store.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createStore(@Req() req, @Body() dto: CreateStoreDto) {
    const userId = req.user.id; 
    return this.storeService.createStore(userId, dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyStore(@Req() req) {
    const userId = req.user.id;
    return this.storeService.getMyStore(userId);
  }
  
  @Get('all')
  async getAllStores() {
    return this.storeService.getAllStores();
  }

  @Get(':storeId/new-arrivals')
  async getNewArrivals(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.storeService.getNewArrivals(storeId);
  }

  @Get(':storeId/top-selling')
  async getTopSelling(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.storeService.getTopSelling(storeId);
  }
}
