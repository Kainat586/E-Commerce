import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

 async generateContent(prompt: string): Promise<string> {
  try {
    // 1) Fetch products from DB
    const products = await this.prisma.product.findMany({
      select: { id: true, name: true, price: true, description: true }
    });

    // Agar products hi na ho toh
    if (products.length === 0) {
      return "No products found in the database.";
    }

    // 2) Convert products list to a readable format
    const productList = products
      .map(p => `ID: ${p.id} | ${p.name} | Rs.${p.price} | ${p.description ?? ''}`)
      .join('\n');

    // 3) Ai ko strictly bolna ke sirf inhi products me se suggest kare
    const finalPrompt = `
You are a product recommendation assistant.
Only recommend products from the list below.
Do NOT create or assume new products.

PRODUCTS LIST:
${productList}

USER REQUEST:
${prompt}

Return answer in friendly plain text.
    `.trim();

    // 4) Call AI
    const result = await this.model.generateContent({
      contents: [{ parts: [{ text: finalPrompt }] }]
    });

    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate content from Gemini.');
  }
}

}