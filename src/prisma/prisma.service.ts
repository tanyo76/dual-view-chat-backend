import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('DB Connected');
    } catch (error) {
      console.log('Cannot connect to DB', error);
      process.exit();
    }
  }
}
