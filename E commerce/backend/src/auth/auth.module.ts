import { Module } from '@nestjs/common';
import { AuthController } from './auth.conrtoller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'universe285', 
      signOptions: { expiresIn: '25s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  exports: [AuthService,JwtModule],
})
export class AuthModule {}
