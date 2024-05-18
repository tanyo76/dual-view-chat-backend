import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from 'src/websocket/websocket.gateway';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async getMessages() {
    return await this.prismaService.message.findMany({
      include: {
        user: true,
      },
    });
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const { message, id } = createMessageDto;
    await this.prismaService.message.create({ data: { message, userId: id } });
  }
}
