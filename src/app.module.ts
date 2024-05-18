import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { MessageModule } from './message/message.module';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    MessageModule,
    OpenaiModule,
  ],
  controllers: [],
  providers: [WebsocketGateway],
})
export class AppModule {}
