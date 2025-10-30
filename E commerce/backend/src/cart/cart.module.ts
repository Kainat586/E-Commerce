import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module'; // ✅

@Module({
  imports: [AuthModule], // ✅ allows using AuthGuard with JwtService
  controllers: [CartController],
  providers: [CartService, PrismaService],
})
export class CartModule {}
