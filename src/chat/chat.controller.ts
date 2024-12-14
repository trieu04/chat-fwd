import { BadRequestException, Body, Controller, Get, HttpCode, Post, Query, RawBodyRequest, Req } from '@nestjs/common';
import NodeCache from 'node-cache';
import { ChatService } from './chat.service';
import { MiddlewareBuilder } from '@nestjs/core';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
    private cache: NodeCache = new NodeCache({ stdTTL: 60 * 60 * 24 });
    constructor(
        private chatService: ChatService,
    ) {
    }
    @Get('4o')
    async get4o(
        @Query('m') message: string,
    ) {
        console.log('get', message);
        return this.handle4o(message);
    }
    @Post('4o')
    
    @HttpCode(200)
    async post4o(
        @Req() req: RawBodyRequest<Request>,
    ) {
        const message = req.rawBody.toString('utf-8');
        console.log('post', message);
        return this.handle4o(message);
    }

    handle4o(message: string) {
        if (!message) throw new BadRequestException('Message is required');
        if (this.cache.has(message)) return this.cache.get(message);

        const result = this.chatService.chat4o(message);

        this.cache.set(message, result);
        return result;
    }

}
