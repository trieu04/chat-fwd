import { BadRequestException, Controller, Get, HttpCode, Logger, Post, Query, RawBodyRequest, Req } from '@nestjs/common';
import NodeCache from 'node-cache';
import { ChatService } from './chat.service';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
    private cache: NodeCache = new NodeCache({ stdTTL: 60 * 60 * 24 });
    private readonly logger = new Logger(ChatController.name);
    constructor(
        private chatService: ChatService,
    ) {
    }

    @Get('4o')
    async get4o(
        @Query('m') message: string,
    ) {
        this.logger.log('get', message);
        return this.handle4o(message);
    }

    @Post('4o')

    @HttpCode(200)
    async post4o(
        @Req() req: RawBodyRequest<Request>,
    ) {
        const message = req.rawBody.toString('utf-8');
        this.logger.log('post', message);
        return this.handle4o(message);
    }

    @Get('c')
    async getC(
        @Query('m') message: string,
    ) {
        this.logger.log('get', message);
        return this.handleC(message);
    }

    @Post('c')
    @HttpCode(200)
    async postC(
        @Req() req: RawBodyRequest<Request>,
    ) {
        const message = req.rawBody.toString('utf-8');
        this.logger.log('post', message);
        return this.handleC(message);
    }

    handleC(message: string) {
        if (!message)
            throw new BadRequestException('Message is required');
        if (this.cache.has(`c:${message}`))
            return this.cache.get(message);
        const result = this.chatService.chatC(message);
        this.cache.set(`c:${message}`, result);

        return this.chatService.chatC(message);
    }

    handle4o(message: string) {
        if (!message)
            throw new BadRequestException('Message is required');
        if (this.cache.has(message))
            return this.cache.get(message);

        const result = this.chatService.chat4o(message);

        this.cache.set(message, result);
        return result;
    }
}
