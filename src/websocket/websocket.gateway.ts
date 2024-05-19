import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { OpenaiService } from 'src/openai/openai.service';

export interface CreateMessageDto {
  id: string;
  email: string;
  message: string;
  assistantMessage: string;
}

// :TODO Add auth middleware to the socket server
@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService,
    private openAiService: OpenaiService,
  ) {}

  @WebSocketServer() io: Server;

  handleConnection(socket: any, ...args: any[]) {
    console.log(socket.id, 'connected');
    // this.io.sockets.emit('message', 'Connected');
  }

  handleDisconnect(socket: any) {
    console.log(socket.id, 'disconnected');
    // this.io.sockets.emit('message', 'Left');
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: any,
    messageDto: CreateMessageDto,
  ): Promise<void> {
    const { email, message } = messageDto;

    const messageString = `${email}: ${message}`;
    this.io.sockets.emit('message', messageString);

    const response = await this.openAiService.sendText(message);
    const assistantMessage = response.choices[0].message.content;
    messageDto = { ...messageDto, assistantMessage };

    await this.messageService.createMessage(messageDto);

    this.io.sockets.emit('openAiMessage', `Assistant: ${assistantMessage}`);
  }
}
