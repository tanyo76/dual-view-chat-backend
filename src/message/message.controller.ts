import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMessages(@Query('withResponse') withResponse: string) {
    let responseCriteria = false;

    if (withResponse && withResponse === 'true') {
      responseCriteria = true;
    }

    return await this.messageService.getMessages(responseCriteria);
  }
}
