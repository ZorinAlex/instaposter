import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);
  private readonly openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY');
    
    this.openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey
    });
  }

  async generateCaption(imageUrl: string, prompt: string): Promise<string> {
      const completion = await this.openai.chat.completions.create({
        model: "meta-llama/llama-3.2-11b-vision-instruct:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 150
      });
      const generatedMessage = completion.choices?.[0]?.message?.content;
      if (generatedMessage) {
        return generatedMessage.trim().replace(/['"]/g, '');
      } else {
        throw new Error('Invalid response from OpenRouter API');
      }
  }
} 