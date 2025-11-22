import { Controller, Post, Body } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { GoogleGenerativeAI } from "@google/generative-ai";

@Controller("ai")
export class AiController {
  private model;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY!;
    const genAI = new GoogleGenerativeAI(apiKey);

    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });
  }

  @Post("assistant")
  async shoppingAssistant(@Body() body: { message: string }) {
    try {
      const userQuery = body.message;

      const products = await this.prisma.product.findMany({
        select: { id: true, name: true, price: true, description: true },
      });

      const prompt = `
User said: "${userQuery}"

Products List:
${JSON.stringify(products, null, 2)}

From above products, suggest the best items in clean bullet points.
`;

      const result = await this.model.generateContent(prompt);
      const reply = result.response.text();

      return { reply };
    } catch (error) {
      console.error(error);
      return { reply: "⚠️ AI is unavailable right now. Try again later." };
    }
  }
}
