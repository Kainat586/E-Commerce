import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiGateway } from './gemini.gateway';

@Module({
  providers: [GeminiService, PrismaService, GeminiGateway],
  exports: [GeminiService],
})
export class GeminiModule {}
