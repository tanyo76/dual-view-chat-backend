import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { MessageService } from 'src/message/message.service';

export interface CreateMessageDto {
  id: string;
  email: string;
  message: string;
}

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessageService) {}

  @WebSocketServer() io: Server;

  handleConnection(socket: any, ...args: any[]) {
    console.log(socket.id, 'connected');
    this.io.sockets.emit('message', 'Connected');
  }

  handleDisconnect(socket: any) {
    console.log(socket.id, 'disconnected');
    this.io.sockets.emit('message', 'Left');
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: any,
    messageDto: CreateMessageDto,
  ): Promise<void> {
    const { email, message } = messageDto;

    await this.messageService.createMessage(messageDto);

    const messageString = `${email}: ${message}`;
    this.io.sockets.emit('message', messageString);
  }
}
