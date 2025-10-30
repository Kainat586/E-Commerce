import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StylesModule } from './styles/styles.module';
import { PrismaService } from './prisma/prisma.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BrandsService } from './brand/brand.service';
import { BrandModule } from './brand/brand.module';
import { SitereviewsModule } from './sitereviews/sitereviews.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [StylesModule, ProductsModule, OrdersModule, UsersModule, ReviewsModule, BrandModule, SitereviewsModule, CartModule, AuthModule],
  controllers: [AppController, UsersController],
  providers: [AppService, PrismaService, UsersService, BrandsService],
})
export class AppModule {}
