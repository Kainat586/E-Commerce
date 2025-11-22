import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GeminiService } from './gemini.service';

@WebSocketGateway({
  cors: { origin: '*' }
})
export class GeminiGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(private readonly geminiService: GeminiService) {}

  handleConnection(socket: any) {
    console.log("Client connected:", socket.id);
  }

  handleDisconnect(socket: any) {
    console.log("Client disconnected:", socket.id);
  }

  @SubscribeMessage('user-message')
  async handleMessage(@MessageBody() message: string) {
    console.log("User:", message);

    const reply = await this.geminiService.generateContent(message);

    this.server.emit('ai-reply', reply);
  }
}
