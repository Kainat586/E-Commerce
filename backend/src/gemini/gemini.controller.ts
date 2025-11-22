// src/gemini/gemini.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';

interface GeneratePromptDto {
  prompt: string;
}

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('generate')
  async generateText(@Body() body: GeneratePromptDto): Promise<{ text: string }> {
    const generatedText = await this.geminiService.generateContent(body.prompt);
    return { text: generatedText };
  }
}