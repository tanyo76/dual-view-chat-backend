import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from 'src/types/messages.types';

@Injectable()
export class MessageService {
  constructor(private prismaService: PrismaService) {}

  async getMessages(withResponse: boolean) {
    return await this.prismaService.message.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        },
        response: withResponse,
      },
    });
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const { message, id, assistantMessage } = createMessageDto;

    this.prismaService.$transaction(async () => {
      const aiResponse = await this.prismaService.openAiResponse.create({
        data: { message: assistantMessage },
      });

      await this.prismaService.message.create({
        data: { message, userId: id, responseId: aiResponse.id },
      });
    });
  }
}
