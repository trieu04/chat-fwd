import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatGPTService } from './chat-gpt.service';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [
        HttpModule,
        ConfigModule,
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGPTService],
})
export class ChatModule {}
