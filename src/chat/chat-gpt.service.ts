import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

interface ChatGPTRequest {
    model: string;
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    max_tokens?: number;
    temperature?: number;
}

interface ChatGPTResponse {
    id: string;
    object: string;
    created: number;
    choices: Array<{ message: { role: string; content: string }; finish_reason: string }>;
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

@Injectable()
export class ChatGPTService {
    private readonly apiKey: string;
    private readonly apiUrl: string = 'https://api.openai.com/v1/chat/completions';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.apiKey = this.configService.get<string>('OPENAI_API_KEY');
    }

    async sendMessage(messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>, options?: { model?: string; max_tokens?: number; temperature?: number }): Promise<string> {
        const requestPayload: ChatGPTRequest = {
            model: options?.model || 'gpt-4o',
            messages,
            max_tokens: options?.max_tokens,
            temperature: options?.temperature,
        };

        const response: AxiosResponse<ChatGPTResponse> = await firstValueFrom(this.httpService
            .post(this.apiUrl, requestPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
            }))
            .catch((e) => {
                const error = {
                    message: 'An error occurred while sending the message to ChatGPT.',
                    response: e?.response?.data,
                };
                throw error;
            });

        const messageContent = response.data.choices[0]?.message?.content;
        if (!messageContent) {
            throw new Error('No response content from ChatGPT.');
        }

        return messageContent;
    }
}
