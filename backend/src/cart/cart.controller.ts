import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Req,
  UseGuards,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateCartDto } from './update-cart.dto';
import { CreateCartDto } from './create-cart.dto';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(@Req() req, @Body() createCartDto: CreateCartDto) {
    try {
      createCartDto.userId = req.user.id;
      return await this.cartService.addToCart(createCartDto);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

@Get()
async getMyCart(@Req() req) {
  try {
    const userId = req.user.id; 
    return await this.cartService.getuserCart(userId);
  } catch (error) {
    throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
@Patch('update')
async updateCartQuantity(
  @Req() req,
  @Body() body: UpdateCartDto & { productId: number }
) {
  try {
    const userId = req.user.id;
    const productId = body.productId;
    const quantity = body.quantity ?? 1; 
    return await this.cartService.updateCartQuantity(userId, productId, quantity);
  } catch (error) {
    throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
  @Delete('remove')
  async removeFromCart(@Req() req, @Body() body: { productId: number }) {
    try {
      const userId = req.user.id;
      return await this.cartService.removeFromCart(userId, body.productId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('clear')
  async clearCart(@Req() req) {
    try {
      const userId = req.user.id;
      return await this.cartService.clearCart(userId);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
