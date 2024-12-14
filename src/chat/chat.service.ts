import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatGPTService } from './chat-gpt.service';

@Injectable()
export class ChatService {
    constructor(
        private readonly ChatGPTService: ChatGPTService,
    ) {

    }
    async chat4o(message: string) {
        return await this.ChatGPTService.sendMessage([
            {
                role: 'user',
                content: message,
            }
        ], {
            model: 'gpt-4o',
        }).catch(e => {
            return new InternalServerErrorException({
                message: e.message,
                response: e?.response,
            })
        });
    }
}
