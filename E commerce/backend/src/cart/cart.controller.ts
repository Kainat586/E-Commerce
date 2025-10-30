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
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ✅ Add to cart (requires login)
  @UseGuards(AuthGuard)
  @Post('add')
  async addToCart(
    @Req() req,
    @Body()
    body: { productId: number; quantity?: number },
  ) {
    const userId = req.user?.id; // From decoded JWT
    return this.cartService.addToCart({ userId, ...body });
  }

  // ✅ Get all cart items for a user (requires login)
  @UseGuards(AuthGuard)
  @Get()
  async getUserCart(@Req() req) {
    const userId = req.user?.id;
    return this.cartService.getCart(userId);
  }

  // ✅ Merge guest cart after login
  @Post('merge')
  async mergeCart(
    @Body() body: { guestId: string; userId: number },
  ) {
    return this.cartService.mergeGuestCartToUser(
      body.guestId,
      body.userId,
    );
  }

  // ✅ Update cart quantity (requires login)
  @UseGuards(AuthGuard)
  @Patch('update')
  async updateCartQuantity(
    @Req() req,
    @Body() body: { productId: number; quantity: number },
  ) {
    const userId = req.user?.id;
    return this.cartService.updateCartQuantity({
      userId,
      ...body,
    });
  }

  // ✅ Remove item from cart (requires login)
  @UseGuards(AuthGuard)
  @Delete('remove')
  async removeFromCart(
    @Req() req,
    @Body() body: { productId: number },
  ) {
    const userId = req.user?.id;
    return this.cartService.removeFromCart({ userId, ...body });
  }
  @Get(':id')
  async getCart(@Param('id') id: string) {
    return this.cartService.getCart(id);
  }
 
  @UseGuards(AuthGuard)
  @Delete('clear')
  async clearCart(@Req() req) {
    const userId = req.user?.id;
    return this.cartService.clearCart(userId);
  }
}
