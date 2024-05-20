import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { OpenaiService } from 'src/openai/openai.service';
import { Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { sendAssistantResponse, sendMessage } from 'src/utils/message.utils';
import { CreateMessageDto } from 'src/types/messages.types';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayConnection {
  constructor(
    private messageService: MessageService,
    private openAiService: OpenaiService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer() io: Server;

  handleConnection(socket: Socket) {
    try {
      const authHeader = socket.handshake.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException();
      }

      const token = authHeader.split(' ')[1];

      verify(token, this.configService.get('JWT_ACCESS_TOKEN_SECRET'));
    } catch (error) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: any,
    messageDto: CreateMessageDto,
  ): Promise<void> {
    const { email, message } = messageDto;

    const messageString = `${email}: ${message}`;
    this.io.sockets.emit('message', sendMessage(messageString));

    const response = await this.openAiService.sendText(message);
    const assistantMessage = response.choices[0].message.content;
    messageDto = { ...messageDto, assistantMessage };

    await this.messageService.createMessage(messageDto);

    this.io.sockets.emit(
      'openAiMessage',
      sendAssistantResponse(assistantMessage),
    );
  }
}
