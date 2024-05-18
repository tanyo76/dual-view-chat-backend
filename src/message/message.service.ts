import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from 'src/websocket/websocket.gateway';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async getMessages(withResponse: boolean) {
    return await this.prismaService.message.findMany({
      include: {
        user: true,
        response: withResponse,
      },
    });
  }

  async createMessage(createMessageDto: CreateMessageDto, responseId) {
    const { message, id } = createMessageDto;
    return await this.prismaService.message.create({
      data: { message, userId: id, responseId },
    });
  }

  async createResponse(message: string) {
    return await this.prismaService.openAiResponse.create({
      data: { message },
    });
  }
}
