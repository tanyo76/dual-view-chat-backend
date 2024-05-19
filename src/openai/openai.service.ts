import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService extends OpenAI {
  constructor(configService: ConfigService) {
    super({ apiKey: configService.get('OPENAI_API_KEY') });
  }

  async sendText(content: string) {
    return await this.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'gpt-4-turbo',
    });
  }
}
