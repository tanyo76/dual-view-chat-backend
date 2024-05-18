import { Controller, Get, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMessages() {
    return await this.messageService.getMessages();
  }
}
