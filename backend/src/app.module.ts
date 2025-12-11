import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { SellerOrdersModule } from './orders/seller-orders/seller-orders.module';

import { SitereviewsModule } from './sitereviews/sitereviews.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { GeminiModule } from './gemini/gemini.module';
import { StoreModule } from './store/store.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    StylesModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    ReviewsModule,
    SitereviewsModule,
    CartModule,
    SellerOrdersModule,
    AuthModule,
    GeminiModule,
    StoreModule,
    StatsModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, PrismaService, UsersService],
  exports: [PrismaService],
})
export class AppModule {}
